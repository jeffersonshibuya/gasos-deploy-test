import { NextResponse } from 'next/server';

import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import {
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand
} from '@aws-sdk/client-s3';
import { marshall } from '@aws-sdk/util-dynamodb';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const { filename, folder, year, electionType, size, county, id } =
    await request.json();

  const s3Response = await s3Client.send(
    new CreateMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename
    })
  );

  const item = {
    id,
    file: filename,
    folder,
    status: 'uploading',
    isPublic: false,
    year,
    electionType,
    size,
    county,
    uploadId: s3Response.UploadId,
    created_at: new Date().toISOString()
  };

  const marshallItem = marshall(item);

  const input = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Item: marshallItem
  };

  const command = new PutItemCommand(input);
  await ddbClient.send(command);

  return NextResponse.json(s3Response);
}

export async function PUT(request: Request) {
  try {
    const data = await request.formData();
    const body = data.get('body') as File;
    const filename = data.get('filename');
    const uploadId = data.get('uploadId');
    const partNumber = data.get('partNumber');

    const bytes = await body.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadPartResponse = await s3Client.send(
      new UploadPartCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: String(filename),
        PartNumber: Number(partNumber),
        UploadId: String(uploadId),
        Body: buffer
      })
    );

    return NextResponse.json(uploadPartResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
