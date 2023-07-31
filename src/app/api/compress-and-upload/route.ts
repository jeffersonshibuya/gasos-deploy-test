import { NextResponse } from 'next/server';

import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import archiver from 'archiver';
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const data = await request.formData();
  const files = data.getAll('files') as File[];
  const folder = data.get('folder') as string;
  const file = data.get('file') as string;

  if (!files) {
    return NextResponse.json({ success: false, message: 'No files selected' });
  }

  // Create a new Archiver instance in memory
  const archive = archiver('zip', { zlib: { level: 9 } });
  const chunks: any[] = [];

  // Add files to the archive
  for await (const file of files) {
    const bytes = await file.arrayBuffer();
    archive.append(Buffer.from(bytes), { name: file.name });
  }

  const responsePromises = [
    new Promise((resolve, reject) => {
      // Listen for data events and collect the compressed chunks in memory
      archive.on('data', (chunk) => {
        chunks.push(chunk);
      });

      archive.on('progress', async (progress) => {
        const percent = (
          (progress.entries.processed / progress.entries.total) *
          100
        ).toFixed(2);

        console.log(percent);
      });

      archive.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        // Upload the compressed ZIP file to S3
        try {
          const parallelUploads3 = new Upload({
            client: s3Client,
            params: {
              Bucket: 'gasos-ballot-gallery-resized',
              Key: `${folder}/${file}.zip`,
              Body: stream
            }
          });

          parallelUploads3.on('httpUploadProgress', (progress) => {
            console.log(progress);
          });

          await parallelUploads3.done();
          resolve(
            NextResponse.json({
              success: true,
              message: 'Files Compressed and Uploaded'
            })
          );
        } catch (error) {
          console.log(error);
          reject(
            NextResponse.json({
              success: false,
              message: `Failed to compress and upload files: ${error}`
            })
          );
        }
      });

      // Finalize the archive
      archive.finalize();
    })
  ];

  const responses = await Promise.all(responsePromises);
  return responses[0];
}
