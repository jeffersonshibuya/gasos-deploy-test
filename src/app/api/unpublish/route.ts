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
  try {
    // Move files to public folder
    const sourceKey = `${folder}/${fileName}`;
    const destinationKey = `${sourceKey}`;
    const bucketName = process.env.AWS_BUCKET_NAME;

    // Create a CopyObjectCommand to copy the file to the new location
    const copyObjectParams = {
      CopySource: `${bucketName}/public/${sourceKey}`,
      Bucket: bucketName,
      Key: destinationKey
    };

    await s3Client.send(new CopyObjectCommand(copyObjectParams));

    // Delete the original file (if needed)
    const deleteObjectParams = {
      Bucket: bucketName,
      Key: 'public/' + sourceKey
    };

    await s3Client.send(new DeleteObjectCommand(deleteObjectParams));
  } catch (error) {
    console.log(error);
  }
};

const updateDynamoDBItem = async (fileId: string) => {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Key: {
      id: { S: fileId }
    },
    UpdateExpression: 'SET #status = :statusValue, #isPublic = :isPublicValue',
    ExpressionAttributeNames: {
      '#status': 'status',
      '#isPublic': 'isPublic'
    },
    ExpressionAttributeValues: {
      ':statusValue': { S: 'waiting-approval' },
      ':isPublicValue': { BOOL: false }
    },
    ReturnValues: 'ALL_NEW'
  };

  const command = new UpdateItemCommand(params);
  const response = await client.send(command);
  return response;
};

export async function POST(request: Request) {
  const { fileId, folder, fileName } = await request.json();

  try {
    await updateS3ObjectKey(folder, fileName);
    const response = await updateDynamoDBItem(fileId);

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
}
