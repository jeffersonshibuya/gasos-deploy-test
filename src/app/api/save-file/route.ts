import { NextResponse } from 'next/server';

import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const { fileName, folder, year, electionType, size } = await request.json();

  try {
    const item = {
      id: randomUUID(),
      file: fileName,
      folder: folder,
      status: 'waiting-approval',
      isPublic: false,
      year,
      electionType,
      size,
      updated_at: new Date().toISOString()
    };
    const marshallItem = marshall(item);

    const input = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Item: marshallItem
    };

    const command = new PutItemCommand(input);
    const response = await client.send(command);

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({});
  }
}
