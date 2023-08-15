import { NextResponse } from 'next/server';

import { CompleteMultipartUploadCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const { filename, uploadId, parts } = await request.json();

  const response = await s3Client.send(
    new CompleteMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts }
    })
  );

  return NextResponse.json(response);
}
