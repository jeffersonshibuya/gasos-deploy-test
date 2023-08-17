import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand
} from '@aws-sdk/client-dynamodb';
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

  const inputEtags = {
    TableName: 'gasos-upload-progress',
    FilterExpression: '#uploadId = :uploadIdValue',
    ExpressionAttributeNames: {
      '#uploadId': 'uploadId'
    },
    ExpressionAttributeValues: {
      ':uploadIdValue': { S: uploadId }
    }
  };

  const commandEtag = new ScanCommand(inputEtags);
  const responseEtag = await ddbClient.send(commandEtag);
  const etags = responseEtag.Items?.map((item) => unmarshall(item)) || [];

  return NextResponse.json({
    ...fileItem,
    etags: etags.map((value: any) => {
      return { partNumber: value.partNumber, etag: value.etag };
    })
  });
}

export async function GET() {
  const headersList = headers();
  const uploadId = headersList.get('uploadId') || '';
  try {
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
    const fileData = response.Items?.map((item) => unmarshall(item))[0] || [];

    const inputTags = {
      TableName: 'gasos-upload-progress',
      Select: 'COUNT',
      ExpressionAttributeValues: { ':uploadIdValue': { S: uploadId } },
      KeyConditionExpression: 'uploadId = :uploadIdValue'
    };

    const commandEtags = new QueryCommand(inputTags);
    const responseEtags = await ddbClient.send(commandEtags);

    return NextResponse.json({
      ...fileData,
      totalPartsUploaded: responseEtags.Count
    });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
