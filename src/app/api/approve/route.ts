import { NextResponse } from 'next/server';

import { S3Client, PutObjectTaggingCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const { folderName, fileName } = await request.json();

  const bucket = process.env.AWS_BUCKET_NAME;

  const input = {
    // PutObjectTaggingRequest
    Bucket: bucket,
    Key: `${folderName}/${fileName}`,
    Tagging: {
      TagSet: [
        {
          Key: 'status',
          Value: 'approved'
        }
      ]
    }
  };
  const command = new PutObjectTaggingCommand(input);
  const response = await s3Client.send(command);

  return NextResponse.json(response);
}
