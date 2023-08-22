import { NextResponse } from 'next/server';

import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { marshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const SESClient = new SESv2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  const { fileName, folder, year, electionType, size, county } =
    await request.json();

  try {
    const item = {
      id: randomUUID(),
      file: fileName,
      folder: folder,
      status: 'awaiting-approval',
      isPublic: false,
      year,
      electionType,
      size,
      county,
      updated_at: new Date().toISOString()
    };
    const marshallItem = marshall(item);

    const input = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Item: marshallItem
    };

    const command = new PutItemCommand(input);
    await client.send(command);

    // send email confirmation
    const inputSES = {
      // SendEmailRequest
      FromEmailAddress: 'jefferson.shibuya@ipc-global.com',
      Destination: {
        // Destination
        ToAddresses: ['jeffersonshibuya@yahoo.com.br']
      },
      Content: {
        Simple: {
          // Message
          Subject: {
            // Content
            Data: 'File Uploaded'
          },
          Body: {
            // Body
            Text: {
              Data: 'Your file was uploaded. GA SOS Admins will check and let you know if approved'
            }
          }
        }
      }
    };

    const commandSES = new SendEmailCommand(inputSES);
    const SESResponse = await SESClient.send(commandSES);

    return NextResponse.json(SESResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.json({});
  }
}
