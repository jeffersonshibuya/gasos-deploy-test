import { NextResponse } from 'next/server';

import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

interface IParams {
  county?: string;
}

export async function POST(request: Request) {
  // const { county } = await request.json();

  const input = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME
    // FilterExpression: 'county = :countyValue',
    // ExpressionAttributeValues: {
    //   ':countyValue': { S: county }
    // }
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
