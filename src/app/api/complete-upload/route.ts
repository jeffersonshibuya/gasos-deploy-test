import { NextResponse } from 'next/server';

import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb';
import { CompleteMultipartUploadCommand, S3Client } from '@aws-sdk/client-s3';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const credentials = {
  region: process.env.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
  }
};

const s3Client = new S3Client(credentials);
const ddbClient = new DynamoDBClient(credentials);
const SESClient = new SESv2Client(credentials);

export async function POST(request: Request) {
  const { fileName, uploadId, id } = await request.json();

  try {
    // get upload parts
    const inputParts = {
      TableName: 'gasos-upload-progress',
      FilterExpression: '#uploadId = :uploadIdValue',
      ExpressionAttributeNames: {
        '#uploadId': 'uploadId'
      },
      ExpressionAttributeValues: {
        ':uploadIdValue': { S: uploadId }
      }
    };

    const commandParts = new ScanCommand(inputParts);
    const responseParts = await ddbClient.send(commandParts);

    const partItems = responseParts.Items?.map((item) => unmarshall(item));

    const parts = partItems
      ?.map((part) => ({
        PartNumber: Number(part.partNumber),
        ETag: part.etag
      }))
      .sort((a, b) => a.PartNumber - b.PartNumber);

    const completeUploadResponse = await s3Client.send(
      new CompleteMultipartUploadCommand({
        Bucket: process.env.NEXT_AWS_BUCKET_NAME,
        Key: fileName,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts }
      })
    );

    if (completeUploadResponse.$metadata?.httpStatusCode === 200) {
      const input = {
        TableName: process.env.NEXT_AWS_DYNAMODB_TABLE_NAME,
        Key: {
          id: { S: id }
        },
        UpdateExpression:
          'SET #statusAttr = :statusValue, #updatedAt = :updatedAtValue',
        ExpressionAttributeNames: {
          '#statusAttr': 'status',
          '#updatedAt': 'updated_at'
        },
        ExpressionAttributeValues: {
          ':statusValue': { S: 'awaiting-approval' },
          ':updatedAtValue': { S: new Date().toISOString() }
        },
        ReturnValues: 'ALL_NEW'
      };

      const command = new UpdateItemCommand(input);
      const response = await ddbClient.send(command);

      // send email confirmation
      const inputSES = {
        FromEmailAddress: 'jefferson.shibuya@ipc-global.com',
        Destination: {
          ToAddresses: ['jeffersonshibuya@yahoo.com.br']
        },
        Content: {
          Simple: {
            Subject: {
              Data: 'File Uploaded'
            },
            Body: {
              Text: {
                Data: 'Your file was uploaded. GA SOS Admins will check and let you know if approved'
              }
            }
          }
        }
      };

      const commandSES = new SendEmailCommand(inputSES);
      await SESClient.send(commandSES);

      return NextResponse.json(unmarshall(response.Attributes || {}));
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
