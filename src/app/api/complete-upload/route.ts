import { NextResponse } from 'next/server';

import { FileResponse } from '@/types';
import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb';
import { CompleteMultipartUploadCommand, S3Client } from '@aws-sdk/client-s3';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const credentials = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
};

const s3Client = new S3Client(credentials);
const ddbClient = new DynamoDBClient(credentials);
const SESClient = new SESv2Client(credentials);

export async function POST(request: Request) {
  const { filename, uploadId, parts, id } = await request.json();

  try {
    const completeUploadResponse = await s3Client.send(
      new CompleteMultipartUploadCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts }
      })
    );

    if (completeUploadResponse.$metadata?.httpStatusCode === 200) {
      const input = {
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
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
          ':statusValue': { S: 'waiting-approval' },
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

      // const commandSES = new SendEmailCommand(inputSES);
      // await SESClient.send(commandSES);

      return NextResponse.json(unmarshall(response.Attributes || {}));
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
