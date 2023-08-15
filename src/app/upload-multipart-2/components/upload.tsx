'use client';

import { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';

import { Button } from '@/components/ui/button';

import { formatBytes } from '@/utils/format-bytes';
import axios from 'axios';

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File>();
  const [uploadId, setUploadId] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  const handleDrop = useCallback(async (acceptedFiles: any) => {
    setFile(acceptedFiles[0]);
    const chunkSize = 5 * 1024 * 1024;
    setTotalChunks(Math.ceil(acceptedFiles[0].size / chunkSize));
  }, []);

  async function handleStartUpload(): Promise<string | null> {
    const response = await axios.post('/api/upload-multipart', {
      filename: file?.name
    });

    if (response.data.$metadata?.httpStatusCode !== 200) {
      alert('Something went wrong');
      return null;
    }

    // setUploadId(response.data.UploadId);
    return response.data.UploadId;
  }

  async function UploadParts(startUploadId: string) {
    // Create an array to store part information
    const parts = [];

    // Calculate part size based on your requirement
    const partSize = 5 * 1024 * 1024; // 5MB parts

    // Start uploading parts
    let offset = 0;
    let partNumber = 1;

    const uploadFile = file || ({} as File);

    while (offset < uploadFile.size) {
      const end = Math.min(offset + partSize, uploadFile.size);
      const part = uploadFile.slice(offset, end);

      const formData = new FormData();
      formData.append('body', part);
      formData.append('filename', file?.name || '');
      formData.append('uploadId', startUploadId);
      formData.append('partNumber', String(partNumber));

      // Upload the part to S3
      const uploadPartResponse = await axios({
        method: 'put',
        url: `${'/api/upload-multipart'}`,
        data: formData
      });

      parts.push({
        ETag: uploadPartResponse.data.ETag,
        PartNumber: partNumber
      });

      setUploadProgress(Math.ceil((partNumber - 1) / totalChunks) * 100);

      offset += partSize;
      partNumber += 1;
    }

    return parts;
  }

  const CompleteUpload = async (
    parts: Array<{ ETag: string; PartNumber: number }>,
    startUploadId: string
  ) => {
    const response = await axios.post('/api/complete-upload', {
      filename: file?.name,
      uploadId: startUploadId,
      parts
    });

    if (response.data.$metadata?.httpStatusCode === 200) {
      setUploadProgress(100);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('no file selected');
      return;
    }

    setUploading(true);

    // Start Upload
    const startUploadId = await handleStartUpload();
    if (startUploadId) {
      setUploadId(startUploadId);

      // Upload parts
      const parts = await UploadParts(startUploadId);

      // Complete the multipart upload
      await CompleteUpload(parts, startUploadId);
    }

    setUploading(false);
  };

  return (
    <>
      <Dropzone onDrop={handleDrop} disabled={uploading}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag and drop files here, or click to select files</p>
            {uploading && <p>Uploading...</p>}
          </div>
        )}
      </Dropzone>
      {file && (
        <div className="my-5 flex flex-col">
          <h2>File</h2>
          <span>Name: {file.name}</span>
          <span>Size: {formatBytes(file.size)}</span>
          <span>Type: {file.type}</span>
          <span>UploadID: {uploadId}</span>
          <span>Total Chunks: {totalChunks}</span>
          <span>Progress: {uploadProgress}%</span>
        </div>
      )}
      <Button onClick={handleUpload}>Upload</Button>
      {uploading && <div>UPLOADING...</div>}
    </>
  );
}
