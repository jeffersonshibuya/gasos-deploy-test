import { NextResponse } from 'next/server';

import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({
  region: process.env.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const { county, year, electionType } = await request.json();

  const input = {
    TableName: process.env.NEXT_AWS_DYNAMODB_TABLE_NAME,
    FilterExpression:
      '#county = :countyValue AND #yearAttr = :yearValue AND #electionType = :electionTypeValue AND #status <> :statusValue',
    ExpressionAttributeNames: {
      '#county': 'county',
      '#yearAttr': 'year',
      '#electionType': 'electionType',
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':countyValue': { S: county },
      ':yearValue': { S: year },
      ':electionTypeValue': { S: electionType },
      ':statusValue': { S: 'rejected' }
    }
  };

  const command = new ScanCommand(input);
  const response = await client.send(command);

  const items = response.Items?.map((item) => unmarshall(item)) || [];

  return NextResponse.json({
    isValid: items?.length === 0,
    status: (items.length > 0 && items ? items[0]?.status : '') || ''
  });
}
