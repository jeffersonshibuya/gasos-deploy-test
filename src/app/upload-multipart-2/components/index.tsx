'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

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
  | 'failed';

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
  const [fileUpload, setFileUpload] = useState<FileUploadProps>(
    {} as FileUploadProps
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bytesLoaded, setBytesLoaded] = useState(0);
  const [fileId, setFileId] = useState('');

  const chunkSize = 10 * 1024 * 1024;

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
    const chunkSize = 10 * 1024 * 1024;
    const totalChunks = Math.ceil((fileUpload?.file?.size || 1) / chunkSize);

    const response = await axios.post('/api/upload-multipart', {
      filename: fileUpload?.file.name,
      folder: folder.trim(),
      year,
      electionType,
      size: fileUpload?.file.size,
      county,
      id,
      totalChunks
    });

    if (response.data.$metadata?.httpStatusCode !== 200) {
      alert('Something went wrong');
      return null;
    }

    const updatedStatus: FileUploadProps = {
      ...fileUpload!,
      status: 'loading'
    };

    setFileUpload(updatedStatus);

    const uploadIdResponse = response.data.UploadId;

    return uploadIdResponse;
  }

  async function UploadParts(
    startUploadId: string,
    id: string,
    initialOffset = 0,
    initialPartNumber = 1
  ) {
    try {
      // Create an array to store part information
      const parts = [];

      // Calculate part size based on your requirement
      const partSize = 10 * 1024 * 1024; // 10MB parts

      // Start uploading parts
      let offset = initialOffset;
      let partNumber = initialPartNumber;

      const uploadFile = fileUpload?.file || ({} as File);

      const chunkSize = 10 * 1024 * 1024;
      const totalChunks = Math.ceil((fileUpload?.file?.size || 1) / chunkSize);

      while (offset < uploadFile.size) {
        const end = Math.min(offset + partSize, uploadFile.size);
        const part = uploadFile.slice(offset, end);

        const formData = new FormData();
        formData.append('body', part);
        formData.append('filename', fileUpload?.file.name || '');
        formData.append('uploadId', startUploadId);
        formData.append('partNumber', String(partNumber));
        formData.append('id', String(id));

        // Upload the part to S3
        const uploadPartResponse = await axios({
          method: 'put',
          url: `${'/api/upload-multipart'}`,
          data: formData
        });

        parts.push({
          ETag: uploadPartResponse.data.ETag as string,
          PartNumber: partNumber
        });

        const progress = ((partNumber - 1) / totalChunks) * 100;
        setUploadProgress(progress);
        setBytesLoaded((partNumber - 1) * chunkSize);

        offset += partSize;
        partNumber += 1;
      }

      return true;
    } catch (error) {
      localStorage.setItem('upload-fail', startUploadId);

      const updatedStatus: FileUploadProps = {
        ...fileUpload!,
        status: 'failed'
      };

      setFileUpload(updatedStatus);

      return null;
    }
  }

  const CompleteUpload = async (startUploadId: string, id: string) => {
    const response = await axios.post('/api/complete-upload', {
      filename: fileUpload?.file.name,
      uploadId: startUploadId,
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
    setFileId(id);

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
      const uploadedParts = await UploadParts(startUploadId, id);

      if (uploadedParts) {
        // Complete the multipart upload
        await CompleteUpload(startUploadId, id);
      }
    }

    setUploading(false);
  };

  const handleRemoveFile = () => {
    setFileUpload({} as FileUploadProps);
  };

  const handleResume = async () => {
    const response = await axios.post('/api/check-file-progress', {
      uploadId: localStorage.getItem('upload-fail')
    });

    const fileData = response.data;

    const initialOffset = (Number(fileData.etags.length) - 1) * chunkSize;
    const initialPartNumber = Number(fileData.etags.length);

    setUploading(true);
    setFileUpload({ ...fileUpload, status: 'loading' });

    if (fileData.uploadId) {
      const uploadedParts = await UploadParts(
        fileData.uploadId,
        fileId,
        initialOffset,
        initialPartNumber
      );

      if (uploadedParts) {
        // Complete the multipart upload
        await CompleteUpload(fileData.uploadId, fileId);
        localStorage.removeItem('upload-fail');
      }
    }

    setUploading(false);
  };

  useEffect(() => {
    async function checkUploadFail() {
      if (localStorage.getItem('upload-fail')) {
        const response = await axios.post('/api/check-file-progress', {
          uploadId: localStorage.getItem('upload-fail')
        });

        const fileData = response.data;
        const progress =
          ((fileData.etags.length - 1) / fileData.totalChunks) * 100;
        setUploadProgress(progress);
        setBytesLoaded((fileData.etags.length - 1) * chunkSize);
        setFileId(uploadCounty.fileData.id);
        setFileUpload({ ...fileUpload, status: 'failed' });
      }
    }

    checkUploadFail();
  }, []);

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
              handleResume={handleResume}
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
