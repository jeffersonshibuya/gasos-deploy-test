import { NextResponse } from 'next/server';

import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const ddbClient = new DynamoDBClient({
  region: process.env.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST() {
  const input = {
    TableName: process.env.NEXT_AWS_DYNAMODB_DOWNLOAD_TABLE_NAME
  };

  try {
    const command = new ScanCommand(input);
    const response = await ddbClient.send(command);

    const items = response.Items?.map((item) => unmarshall(item)) || [];

    return NextResponse.json(items);
  } catch (error) {
    console.log('Error', error);
    return NextResponse.json({ files: [] });
  }
}
