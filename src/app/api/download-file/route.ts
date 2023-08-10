import { NextResponse } from 'next/server';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const { fileName, folder, isPublic } = await request.json();

  try {
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${isPublic && 'public/'}${folder}/${fileName}`
      }),
      { expiresIn: 60 }
    );

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({});
}
