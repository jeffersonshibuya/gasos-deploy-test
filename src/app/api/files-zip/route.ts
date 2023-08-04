import { NextResponse } from 'next/server';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import AdmZip from 'adm-zip';
import { PassThrough, type Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});
// Function to convert hierarchy to the desired format
// Function to convert hierarchy to the desired format
function convertHierarchy(node: any): any {
  const result = [];
  for (const key in node) {
    if (key !== null) {
      if (node[key] === null) {
        result.push(key); // Add file to result
      } else {
        result.push({ folder: key, files: convertHierarchy(node[key]) });
      }
    }
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Read the zip file's content without unzipping it
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();

    // Create an object to store folder names as keys and an array of file names as values
    const folderContents: any = {};

    // // Create a hierarchical structure for folders and files
    const hierarchy = {};
    const zipEntries2 = zipEntries.map((z) => z.entryName);
    for (const entry of zipEntries2) {
      const parts = entry.split('/');
      let currentLevel: any = hierarchy;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!currentLevel[part]) {
          if (i === parts.length - 1) {
            currentLevel[part] = null; // File entry
          } else {
            currentLevel[part] = {}; // Subfolder
          }
        }
        currentLevel = currentLevel[part];
      }
    }

    // Convert and print the hierarchy
    const convertedHierarchy = convertHierarchy(hierarchy);
    return NextResponse.json(convertedHierarchy);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
