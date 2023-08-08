import { NextResponse } from 'next/server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const data = await request.formData();
  const file = data.get('files') as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadParams = {
    Bucket: 'gasos-ballot-gallery',
    Key: file.name,
    Body: buffer,
    ContentType: file.type
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return NextResponse.json({ message: 'success' });
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: 'Error uploading file to S3' });
  }
}
