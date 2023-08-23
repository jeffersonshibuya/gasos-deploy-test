import { NextResponse } from 'next/server';

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectTaggingCommand
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST() {
  const input = {
    Bucket: process.env.NEXT_AWS_BUCKET_NAME
  };

  try {
    const command = new ListObjectsV2Command(input);
    const s3Response = await s3Client.send(command);

    const files = [];
    for (const object of s3Response.Contents || []) {
      const fileName = object?.Key?.split('/').pop();

      // Getting tags
      const inputTagging = {
        Bucket: process.env.NEXT_AWS_BUCKET_NAME,
        Key: object.Key
      };
      const command = new GetObjectTaggingCommand(inputTagging);
      const response = await s3Client.send(command);
      const status =
        response.TagSet?.filter((tag) => tag.Key === 'status')[0]?.Value || '';

      files.push({
        key: object.Key,
        name: fileName,
        url:
          `https://${process.env.NEXT_AWS_BUCKET_NAME}.s3.us-east-1.amazonaws.com/` +
          object.Key,
        modified_at: object.LastModified,
        size: object.Size,
        status
      });
    }

    // const files =
    //   s3Response.Contents?.map((content: any) => {
    //     const fileName = content.Key.split('/').pop();

    //     return {
    //       key: content.Key,
    //       name: fileName,
    //       url:
    //         `https://${process.env.NEXT_AWS_BUCKET_NAME}.s3.us-east-1.amazonaws.com/` +
    //         content.Key,
    //       modified_at: content.LastModified,
    //       size: content.Size
    //     };
    //   }) || [];

    return NextResponse.json({ files });
  } catch (error) {
    console.log('Error', error);
    return NextResponse.json({ files: [] });
  }
}
