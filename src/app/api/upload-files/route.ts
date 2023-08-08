import { NextResponse } from 'next/server';

import {
  S3Client,
  PutObjectCommand,
  PutObjectTaggingCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const { fileName, fileType } = await request.json();

  try {
    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: 'gasos-ballot-gallery',
        Key: fileName,
        ContentType: fileType
      }),
      { expiresIn: 600 }
    );

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(request: Request) {
  const { fileName } = await request.json();
  console.log(fileName);

  // Define the status tag
  const tagsToAdd = [{ Key: 'status', Value: 'waiting-approval' }];

  try {
    // Add tags to the uploaded object
    const putObjectTaggingParams = {
      Bucket: 'gasos-ballot-gallery',
      Key: fileName,
      Tagging: { TagSet: tagsToAdd }
    };

    await s3Client.send(new PutObjectTaggingCommand(putObjectTaggingParams));

    return NextResponse.json({ message: 'ok' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'error' });
  }
}
