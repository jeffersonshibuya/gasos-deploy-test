/* eslint-disable prettier/prettier */
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

export async function POST(request: Request) {
  const { year, electionType, county } = await request.json();

  let filterExpression = '#year = :yearValue AND #isPublic = :isPublicValue';
  const expressionValues: { [key: string]: any } = {
    ':yearValue': { S: year },
    ':isPublicValue': { BOOL: true }
  }

  if (electionType !== undefined) {
    filterExpression += ' AND electionType = :electionTypeValue'
    expressionValues[':electionTypeValue'] = { S: electionType }
  }

  if (county !== undefined) {
    filterExpression += ' AND county = :countyValue';
    expressionValues[':countyValue'] = { S: county }
  }



  const input = {
    TableName: process.env.NEXT_AWS_DYNAMODB_TABLE_NAME,
    FilterExpression: filterExpression,
    ExpressionAttributeNames: {
      '#year': 'year',
      '#isPublic': 'isPublic',
    },
    ExpressionAttributeValues: expressionValues
  };

  const command = new ScanCommand(input);
  const response = await ddbClient.send(command);
  const items = response.Items?.map((item) => unmarshall(item)) || [];

  return NextResponse.json(items);
}
