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
    Bucket: 'gasos-ballot-gallery-resized',
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

  // console.log(file);
  // NextResponse.json({ success: false });

  // Set up the AWS S3 client
  // const s3Client = new S3Client({
  //   region: process.env.AWS_REGION,
  //   credentials: {
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  //   }
  // });

  // // Set up the S3 upload parameters
  // const uploadParams = {
  //   Bucket: 'gasos-ballot-image-gallery',
  //   Key: Date.now().toString() + '-' + file.originalname,
  //   Body: file.buffer,
  //   ContentType: file.mimetype,
  //   ACL: 'public-read'
  // };

  // try {
  //   await s3Client.send(new PutObjectCommand(uploadParams));

  //   NextResponse.json({ message: 'success' });
  // } catch (error) {
  //   console.error(error);
  //   NextResponse.json({ error: 'Error uploading file to S3' });
  // }

  // const body = await request.json();

  // console.log(body);
  // try {
  //   const uploadPromises = files.map(async (file: any) => {
  //     const objectParams = {
  //       Bucket: 'gasos-ballot-gallery',
  //       Key: file.originalname,
  //       Body: file.buffer
  //     };

  //     // Upload the file to S3 with progress tracking
  //     const upload = new Upload({
  //       client,
  //       params: objectParams
  //     });

  //     // Subscribe to progress events
  //     upload.on('httpUploadProgress', (progress) => {
  //       const percentCompleted = Math.round(
  //         (progress.loaded || 1 / (progress.total || 1)) * 100
  //       );
  //       console.log(`Progress for ${file.originalname}: ${percentCompleted}%`);
  //     });

  //     await upload.done();

  //     return file.originalname;
  //   });

  //   // Wait for all files to be uploaded
  //   const uploadedFiles = await Promise.all(uploadPromises);

  //   NextResponse.json({ files: uploadedFiles });
  // } catch (error) {
  //   console.error('Upload failed:', error);
  //   NextResponse.json({ error: 'Upload failed' });
  // }
}
