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
  const {
    email,
    firstName,
    lastName,
    organization,
    electionType,
    year,
    county
  } = await request.json();

  try {
    const item = {
      email,
      firstName,
      lastName,
      organization,
      electionType,
      year,
      county,
      date_requested: new Date().toISOString()
    };
    const marshallItem = marshall(item);

    const input = {
      TableName: process.env.AWS_DYNAMODB_DOWNLOAD_TABLE_NAME,
      Item: marshallItem
    };

    const command = new PutItemCommand(input);
    const response = await client.send(command);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(error);
  }
}
