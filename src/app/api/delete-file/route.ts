import { NextResponse } from 'next/server';

import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({
  region: process.env.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const { id } = await request.json();

  try {
    const input = {
      TableName: process.env.NEXT_AWS_DYNAMODB_TABLE_NAME,
      Key: {
        id: { S: id }
      }
    };

    const command = new DeleteItemCommand(input);
    const response = await ddbClient.send(command);

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
