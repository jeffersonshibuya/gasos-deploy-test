'use client';

import { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';

import {
  DynamoDBClient,
  UpdateItemCommand,
  PutItemCommand
} from '@aws-sdk/client-dynamodb';
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand
} from '@aws-sdk/client-s3';
import { marshall } from '@aws-sdk/util-dynamodb';
import axios from 'axios';

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [uploadId, setUploadId] = useState('');

  const handleDrop = useCallback(async (acceptedFiles: any) => {
    const s3 = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'AKIARQKPMY4Y6TV6TFFU',
        secretAccessKey: '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'
      }
    });
    const ddb = new DynamoDBClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'AKIARQKPMY4Y6TV6TFFU',
        secretAccessKey: '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'
      }
    });

    const params = {
      TableName: 'gasos-upload-progress',
      Item: {
        UploadId: Date.now().toString(),
        status: 'Pending'
      }
    };

    try {
      const marshallItem = marshall(params.Item);

      const input = {
        TableName: params.TableName,
        Item: marshallItem
      };

      await ddb.send(new PutItemCommand(input));
      setUploadId(params.Item.UploadId);

      // Create an array to store part information
      const parts = [];

      // Calculate part size based on your requirement
      const partSize = 5 * 1024 * 1024; // 5MB parts

      // Start uploading parts
      let offset = 0;
      let partNumber = 1;

      const s3Response = await s3.send(
        new CreateMultipartUploadCommand({
          Bucket: 'gasos-ballot-gallery',
          Key: `uploads/${uploadId}-${acceptedFiles[0].name}`
        })
      );

      while (offset < acceptedFiles[0].size) {
        const end = Math.min(offset + partSize, acceptedFiles[0].size);
        const part = acceptedFiles[0].slice(offset, end);

        // Upload the part to S3
        const uploadPartResponse = await s3.send(
          new UploadPartCommand({
            Bucket: 'gasos-ballot-gallery',
            Key: `uploads/${uploadId}-${acceptedFiles[0].name}`,
            PartNumber: partNumber,
            UploadId: s3Response.UploadId,
            Body: part
          })
        );

        parts.push({
          ETag: uploadPartResponse.ETag,
          PartNumber: partNumber
        });

        offset += partSize;
        partNumber += 1;
      }

      // Complete the multipart upload
      await s3.send(
        new CompleteMultipartUploadCommand({
          Bucket: 'gasos-ballot-gallery',
          Key: `uploads/${uploadId}-${acceptedFiles[0].name}`,
          UploadId: s3Response.UploadId,
          MultipartUpload: { Parts: parts }
        })
      );

      // Update DynamoDB with successful status
      await ddb.send(
        new UpdateItemCommand({
          TableName: 'gasos-upload-progress',
          Key: { UploadId: { S: params.Item.UploadId } },
          UpdateExpression: 'set #statusAttr = :statusValue',
          ExpressionAttributeNames: {
            '#statusAttr': 'status'
          },
          ExpressionAttributeValues: {
            ':statusValue': { S: 'Completed' }
          }
        })
      );

      console.log('File uploaded successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);

      // Update DynamoDB with failed status
      await ddb.send(
        new UpdateItemCommand({
          TableName: 'gasos-upload-progress',
          Key: { UploadId: { S: params.Item.UploadId } },
          UpdateExpression: 'set #statusAttr = :statusValue',
          ExpressionAttributeNames: {
            '#statusAttr': 'status'
          },
          ExpressionAttributeValues: {
            ':statusValue': { S: 'Failed' }
          }
        })
      );
    } finally {
      setUploading(false);
    }
  }, []);

  return (
    <Dropzone onDrop={handleDrop} disabled={uploading}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag and drop files here, or click to select files</p>
          {uploading && <p>Uploading...</p>}
        </div>
      )}
    </Dropzone>
  );
}
