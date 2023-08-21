import { NextResponse } from 'next/server';

import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST() {
  try {
    const input = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      FilterExpression: '#status <> :statusValue',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':statusValue': { S: 'uploading' }
      }
    };
    const command = new ScanCommand(input);
    const response = await client.send(command);

    const items = response.Items?.map((item) => unmarshall(item));

    return NextResponse.json(items);
  } catch (error) {
    console.log(error);
  }
}
