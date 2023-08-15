import { NextResponse } from 'next/server';

import {
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const { filename } = await request.json();

  const s3Response = await s3Client.send(
    new CreateMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename
    })
  );

  return NextResponse.json(s3Response);
}

export async function PUT(request: Request) {
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
}
