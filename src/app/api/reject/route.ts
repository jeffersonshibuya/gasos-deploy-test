import { NextResponse } from 'next/server';

import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.NEXT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
  }
});

// const SESClient = new SESv2Client({
//   region: process.env.NEXT_AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
//     secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
//   }
// });

const updateDynamoDBItem = async (fileId: string, reason: string) => {
  const params = {
    TableName: process.env.NEXT_AWS_DYNAMODB_TABLE_NAME,
    Key: {
      id: { S: fileId }
    },
    UpdateExpression:
      'SET #status = :statusValue, #reason = :reasonValue, #updatedAt = :updatedAtValue',
    ExpressionAttributeNames: {
      '#status': 'status',
      '#reason': 'reason',
      '#updatedAt': 'updated_at'
    },
    ExpressionAttributeValues: {
      ':statusValue': { S: 'rejected' },
      ':reasonValue': { S: reason },
      ':updatedAtValue': { S: new Date().toISOString() }
    },
    ReturnValues: 'ALL_NEW'
  };

  const command = new UpdateItemCommand(params);
  const response = await client.send(command);
  return response;
};

export async function POST(request: Request) {
  const { fileId, reason } = await request.json();

  try {
    // await updateS3ObjectKey(folder, fileName);
    const response = await updateDynamoDBItem(fileId, reason);

    // send email confirmation
    // const inputSES = {
    //   // SendEmailRequest
    //   FromEmailAddress: 'jefferson.shibuya@ipc-global.com',
    //   Destination: {
    //     // Destination
    //     ToAddresses: ['jeffersonshibuya@yahoo.com.br']
    //   },
    //   Content: {
    //     Simple: {
    //       Subject: {
    //         Data: 'File Rejected'
    //       },
    //       Body: {
    //         Text: {
    //           Data: `Your file was rejected. Please fix the issues and upload again. \n\n Reason: ${reason}`
    //         }
    //       }
    //     }
    //   }
    // };

    // const commandSES = new SendEmailCommand(inputSES);
    // await SESClient.send(commandSES);

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
}
