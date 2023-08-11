import { NextResponse } from 'next/server';

import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const SESClient = new SESv2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const updateS3ObjectKey = async (folder: string, fileName: string) => {
  // Move files to public folder
  const sourceKey = `${folder}/${fileName}`;
  const destinationKey = `rejected/${sourceKey}`;
  const bucketName = process.env.AWS_BUCKET_NAME;

  // Create a CopyObjectCommand to copy the file to the new location
  const copyObjectParams = {
    CopySource: `/${bucketName}/${sourceKey}`,
    Bucket: bucketName,
    Key: destinationKey
  };

  await s3Client.send(new CopyObjectCommand(copyObjectParams));

  // Delete the original file (if needed)
  const deleteObjectParams = {
    Bucket: bucketName,
    Key: sourceKey
  };

  await s3Client.send(new DeleteObjectCommand(deleteObjectParams));
};

const updateDynamoDBItem = async (
  fileId: string,
  reason: string,
  folder: string
) => {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Key: {
      id: { S: fileId }
    },
    UpdateExpression:
      'SET #status = :statusValue, #reason = :reasonValue, #folder = :folderValue',
    ExpressionAttributeNames: {
      '#status': 'status',
      '#reason': 'reason',
      '#folder': 'folder'
    },
    ExpressionAttributeValues: {
      ':statusValue': { S: 'rejected' },
      ':reasonValue': { S: reason },
      ':folderValue': { S: 'rejected/' + folder }
    },
    ReturnValues: 'ALL_NEW'
  };

  const command = new UpdateItemCommand(params);
  const response = await client.send(command);
  return response;
};

export async function POST(request: Request) {
  const { fileId, folder, fileName, reason } = await request.json();

  try {
    await updateS3ObjectKey(folder, fileName);
    const response = await updateDynamoDBItem(fileId, reason, folder);

    // send email confirmation
    const inputSES = {
      // SendEmailRequest
      FromEmailAddress: 'jefferson.shibuya@ipc-global.com',
      Destination: {
        // Destination
        ToAddresses: ['jeffersonshibuya@yahoo.com.br']
      },
      Content: {
        Simple: {
          Subject: {
            Data: 'File Rejected'
          },
          Body: {
            Text: {
              Data: `Your file was rejected. Please fix the issues and upload again. \n\n Reason: ${reason}`
            }
          }
        }
      }
    };

    const commandSES = new SendEmailCommand(inputSES);
    await SESClient.send(commandSES);

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
}
