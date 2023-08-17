import { NextResponse } from 'next/server';

import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const credentials = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
};

const ddbClient = new DynamoDBClient(credentials);

export async function POST(request: Request) {
  const { uploadId } = await request.json();

  const input = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    FilterExpression: '#uploadId = :uploadIdValue',
    ExpressionAttributeNames: {
      '#uploadId': 'uploadId'
    },
    ExpressionAttributeValues: {
      ':uploadIdValue': { S: uploadId }
    }
  };

  const command = new ScanCommand(input);
  const response = await ddbClient.send(command);

  const fileItem = response.Items?.map((item) => unmarshall(item))[0] || [];

  return NextResponse.json(fileItem);
}
