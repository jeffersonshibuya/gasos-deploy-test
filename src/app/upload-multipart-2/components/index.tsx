'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import UploadDropArea from './upload-drop-area';
import UploadForm from './upload-form';
import { UploadTable } from './upload-table';

import useUploadCounty from '@/hooks/useUploadCounty';
import { fadeIn, itemVariants } from '@/utils/animation';
import axios from 'axios';
import { motion } from 'framer-motion';

export type FileStatus =
  | 'pending'
  | 'loading'
  | 'waiting-approval'
  | 'canceled'
  | 'error';

export type FileUploadProps = {
  file: File;
  uploadProgress?: number | null;
  sizeLoaded?: number | null;
  timeRamaining?: number | null;
  status: FileStatus;
};

export default function Upload() {
  const uploadCounty = useUploadCounty();
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [fileUpload, setFileUpload] = useState<FileUploadProps>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bytesLoaded, setBytesLoaded] = useState(0);

  // const [totalChunks, setTotalChunks] = useState(0);

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    setFileUpload({
      file: acceptedFiles[0],
      status: 'pending'
    });
  }, []);

  async function handleStartUpload(
    id: string,
    folder: string,
    year: string,
    electionType: string,
    county: string
  ): Promise<string | null> {
    const response = await axios.post('/api/upload-multipart', {
      filename: fileUpload?.file.name,
      folder: folder.trim(),
      year,
      electionType,
      size: fileUpload?.file.size,
      county,
      id
    });

    if (response.data.$metadata?.httpStatusCode !== 200) {
      alert('Something went wrong');
      return null;
    }

    const updatedStatus: FileUploadProps = {
      ...fileUpload!,
      status: 'loading'
    };

    setFileUpload((prevState) => {
      return updatedStatus;
    });

    return response.data.UploadId;
  }

  async function UploadParts(startUploadId: string) {
    // Create an array to store part information
    const parts = [];

    // Calculate part size based on your requirement
    const partSize = 10 * 1024 * 1024; // 10MB parts

    // Start uploading parts
    let offset = 0;
    let partNumber = 1;

    const uploadFile = fileUpload?.file || ({} as File);

    const chunkSize = 10 * 1024 * 1024;
    const totalChunks = (fileUpload?.file?.size || 1) / chunkSize;
    console.log(totalChunks);

    while (offset < uploadFile.size) {
      const end = Math.min(offset + partSize, uploadFile.size);
      const part = uploadFile.slice(offset, end);

      const formData = new FormData();
      formData.append('body', part);
      formData.append('filename', fileUpload?.file.name || '');
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

      const progress = ((partNumber - 1) / totalChunks) * 100;
      setUploadProgress(progress);
      setBytesLoaded((partNumber - 1) * chunkSize);

      offset += partSize;
      partNumber += 1;
    }

    return parts;
  }

  const CompleteUpload = async (
    parts: Array<{ ETag: string; PartNumber: number }>,
    startUploadId: string,
    id: string
  ) => {
    const response = await axios.post('/api/complete-upload', {
      filename: fileUpload?.file.name,
      uploadId: startUploadId,
      parts,
      id
    });

    setUploadProgress(100);
    setBytesLoaded(fileUpload?.file.size || 0);

    const updatedStatus: FileUploadProps = {
      ...fileUpload!,
      status: response.data.status
    };

    setFileUpload((prevState) => {
      return updatedStatus;
    });
  };

  const handleUpload = async (
    folder: string,
    year: string,
    electionType: string,
    county: string
  ) => {
    if (!fileUpload?.file) {
      alert('no file selected');
      return;
    }

    setUploading(true);
    const id = `${year}-${county}-${electionType}`.trim().replace(/\s/g, '_');

    // Start Upload
    const startUploadId = await handleStartUpload(
      id,
      folder,
      year,
      electionType,
      county
    );

    if (startUploadId) {
      // Upload parts
      const parts = await UploadParts(startUploadId);

      // Complete the multipart upload
      await CompleteUpload(parts, startUploadId, id);
    }

    setUploading(false);
  };

  const handleRemoveFile = () => {
    setFileUpload({} as FileUploadProps);
  };

  return (
    <>
      <UploadDropArea handleDropFiles={handleDrop} />
      {fileUpload?.file && (
        <motion.div variants={fadeIn} initial="hidden" animate="show">
          <motion.div variants={itemVariants} className="my-4">
            {fileUpload.status !== 'waiting-approval' && (
              <UploadForm
                handleUpload={handleUpload}
                cancelUpload={() => console.log('cancel')}
                countyUploadData={uploadCounty.fileData}
                isLoading={uploading}
              />
            )}
          </motion.div>
          <motion.div variants={itemVariants} className="my-4">
            <UploadTable
              fileUpload={fileUpload}
              handleRemoveFile={handleRemoveFile}
              uploadProgress={uploadProgress}
              bytesLoaded={bytesLoaded}
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
