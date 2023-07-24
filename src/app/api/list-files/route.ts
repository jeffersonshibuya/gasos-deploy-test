import { NextResponse } from 'next/server';

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST() {
  const input = {
    Bucket: process.env.AWS_BUCKET_NAME
  };

  try {
    const command = new ListObjectsV2Command(input);
    const s3Response = await s3Client.send(command);

    const files =
      s3Response.Contents?.map((content: any) => {
        const fileName = content.Key.split('/').pop();
        return {
          key: content.Key,
          name: fileName,
          url:
            `https://${process.env.AWS_BUCKET_NAME}.s3.us-east-1.amazonaws.com/` +
            content.Key,
          modified_at: content.LastModified,
          size: content.Size
        };
      }) || [];

    return NextResponse.json({ files });
  } catch (error) {
    console.log('Error');
    return NextResponse.json({ files: [] });
  }
}
