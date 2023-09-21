import { NextResponse } from 'next/server';

import {
  DynamoDBClient,
  UpdateItemCommand,
  PutItemCommand
} from '@aws-sdk/client-dynamodb';
import {
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand
} from '@aws-sdk/client-s3';
import { marshall } from '@aws-sdk/util-dynamodb';

const s3Client = new S3Client({
  region: process.env.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
  }
});

const ddbClient = new DynamoDBClient({
  region: process.env.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  try {
    const {
      fileName,
      originalFile,
      year,
      electionType,
      size,
      county,
      id,
      totalChunks
    } = await request.json();

    const s3Response = await s3Client.send(
      new CreateMultipartUploadCommand({
        Bucket: process.env.NEXT_AWS_BUCKET_NAME,
        Key: fileName
      })
    );

    const input = {
      TableName: process.env.NEXT_AWS_DYNAMODB_TABLE_NAME,
      Key: {
        id: { S: id }
      },
      UpdateExpression: `SET #statusAttr = :statusValue, updated_at = :updatedAtValue,
        created_at = :createdAtValue,
        #fileAttr = :fileValue,
        originalFile = :originalFileValue,
        isPublic = :isPublicValue,
        #yearAttr = :yearValue,
        electionType = :electionTypeValue,
        size = :sizeValue,
        county = :countyValue,
        totalChunks = :totalChunksValue,
        uploadId = :uploadIdValue
      `,
      ExpressionAttributeNames: {
        '#statusAttr': 'status',
        '#fileAttr': 'file',
        '#yearAttr': 'year'
      },
      ExpressionAttributeValues: {
        ':statusValue': { S: 'uploading' },
        ':updatedAtValue': { S: new Date().toISOString() },
        ':createdAtValue': { S: new Date().toISOString() },
        ':fileValue': { S: fileName },
        ':originalFileValue': { S: originalFile },
        ':isPublicValue': { BOOL: false },
        ':yearValue': { S: year },
        ':electionTypeValue': { S: electionType },
        ':sizeValue': { S: size.toString() },
        ':countyValue': { S: county },
        ':totalChunksValue': { S: totalChunks.toString() },
        ':uploadIdValue': { S: s3Response.UploadId || '' }
      }
    };

    const command = new UpdateItemCommand(input);
    await ddbClient.send(command);

    return NextResponse.json(s3Response);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.formData();
    const body = data.get('body') as File;
    const fileName = data.get('fileName');
    const uploadId = data.get('uploadId');
    const partNumber = data.get('partNumber') as string;

    const bytes = await body.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadPartResponse = await s3Client.send(
      new UploadPartCommand({
        Bucket: process.env.NEXT_AWS_BUCKET_NAME,
        Key: String(fileName),
        PartNumber: Number(partNumber),
        UploadId: String(uploadId),
        Body: buffer
      })
    );

    // save last etag and partnumber uploaded for recovery purpuses
    const item = {
      uploadId,
      etag: uploadPartResponse.ETag,
      partNumber
    };

    const marshallItem = marshall(item);

    const input = {
      TableName: process.env.NEXT_AWS_DYNAMODB_UPLOAD_PROGRESS_TABLE_NAME,
      Item: marshallItem
    };

    const command = new PutItemCommand(input);
    await ddbClient.send(command);

    return NextResponse.json(uploadPartResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
