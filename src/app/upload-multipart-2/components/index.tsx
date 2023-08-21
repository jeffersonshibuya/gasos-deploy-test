'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Loader from '@/components/Loader';

import UploadForm from './upload-form';
import { UploadTable } from './upload-table';

import useUploadCounty from '@/hooks/useUploadCounty';
import { FilesDBResponseData } from '@/types';
import { fadeIn, itemVariants } from '@/utils/animation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

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
  const searchParams = useSearchParams();
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [fileUpload, setFileUpload] = useState<FileUploadProps>(
    {} as FileUploadProps
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bytesLoaded, setBytesLoaded] = useState(0);
  const [fileId, setFileId] = useState('');
  const [fileStatus, setFileStatus] = useState<FileStatus>('pending');
  const [fileFailed, setFileFailed] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chunkSize = 10 * 1024 * 1024;

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (fileStatus === 'failed' && acceptedFiles[0].name !== fileFailed) {
        toast.error(`Please select the correct file: ${fileFailed}`);
      } else {
        setFileUpload({
          file: acceptedFiles[0],
          status: fileStatus
        });
      }
    },
    [fileFailed, fileStatus]
  );

  async function handleStartUpload(
    id: string,
    fileName: string,
    originalFile: string,
    year: string,
    electionType: string,
    county: string
  ): Promise<string | null> {
    const chunkSize = 10 * 1024 * 1024;
    const totalChunks = Math.ceil((fileUpload?.file?.size || 1) / chunkSize);

    const response = await axios.post('/api/upload-multipart', {
      fileName,
      year,
      originalFile,
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

    setFileStatus('loading');

    const uploadIdResponse = response.data.UploadId;

    return uploadIdResponse;
  }

  async function UploadParts(
    startUploadId: string,
    id: string,
    fileName: string,
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
        formData.append('fileName', fileName);
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
      localStorage.setItem(`upload-fail-${id}`, startUploadId);
      setFileId(id);
      setFileStatus('failed');

      return null;
    }
  }

  const CompleteUpload = async (
    startUploadId: string,
    id: string,
    fileName: string
  ) => {
    const response = await axios.post('/api/complete-upload', {
      uploadId: startUploadId,
      id,
      fileName
    });

    setUploadProgress(100);
    setBytesLoaded(fileUpload?.file.size || 0);
    setFileStatus(response.data.status);

    router.push('/list-approval');
  };

  const handleUpload = async (
    fileName: string,
    year: string,
    electionType: string,
    county: string
  ) => {
    if (!fileUpload?.file) {
      alert('no file selected');
      return;
    }

    const fileNameFormatted = fileName + '.zip';

    setUploading(true);
    const id = `${year}-${electionType}-${county}`.trim().replace(/\s/g, '_');
    setFileId(id);

    // Start Upload
    const startUploadId = await handleStartUpload(
      id,
      fileNameFormatted,
      fileUpload?.file.name,
      year,
      electionType,
      county
    );

    if (startUploadId) {
      // Upload parts
      const uploadedParts = await UploadParts(
        startUploadId,
        id,
        fileNameFormatted
      );

      if (uploadedParts) {
        // Complete the multipart upload
        await CompleteUpload(startUploadId, id, fileNameFormatted);
      }
    }

    setUploading(false);
  };

  const handleRemoveFile = () => {
    setFileUpload({} as FileUploadProps);
  };

  const handleResume = async () => {
    const response = await axios.post('/api/check-file-progress', {
      uploadId: localStorage.getItem(`upload-fail-${fileId}`)
    });

    const fileData = response.data;

    const initialOffset = (Number(fileData.etags.length) - 1) * chunkSize;
    const initialPartNumber = Number(fileData.etags.length);

    setUploading(true);
    setFileStatus('loading');

    if (fileData.uploadId) {
      const uploadedParts = await UploadParts(
        fileData.uploadId,
        fileId,
        fileData.file,
        initialOffset,
        initialPartNumber
      );

      if (uploadedParts) {
        // Complete the multipart upload
        await CompleteUpload(fileData.uploadId, fileId, fileData.file);
        localStorage.removeItem(`upload-fail-${fileId}`);
      }
    }

    setUploading(false);
  };

  const checkUploadFail = useCallback(async () => {
    setIsLoading(true);
    if (localStorage.getItem(`upload-fail-${uploadCounty.fileData.id}`)) {
      const response = await axios.post('/api/check-file-progress', {
        uploadId: localStorage.getItem(
          `upload-fail-${uploadCounty.fileData.id}`
        )
      });

      const fileData = response.data;
      uploadCounty.setFileData(response.data);

      const progress =
        ((fileData.etags.length - 1) / fileData.totalChunks) * 100;
      setUploadProgress(progress);
      setBytesLoaded((fileData.etags.length - 1) * chunkSize);
      setFileFailed(fileData.originalFile);
      setFileStatus('failed');
      setFileId(fileData.id);
    }
    setIsLoading(false);
  }, [chunkSize, uploadCounty]);

  useEffect(() => {
    const countyId = searchParams?.get('county');
    if (!countyId) {
      uploadCounty.setFileData({} as FilesDBResponseData);
      setFileStatus('pending');
      setUploadProgress(0);
      setBytesLoaded(0);
      setFileId('');
      setFileFailed('');
      setFileUpload({} as FileUploadProps);
    } else {
      checkUploadFail();
    }
  }, [searchParams]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {fileFailed && (
        <div className="mb-4 border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="flex gap-3 text-sm text-yellow-700">
                <span className="text-md font-semibold">File failed!</span>
                <span className="flex text-yellow-700 hover:text-yellow-600">
                  {!fileUpload.file ? (
                    <span>
                      Please select the same file:{' '}
                      <strong className="mx-1">{fileFailed}</strong>
                    </span>
                  ) : (
                    <span className="flex items-center ">
                      Please click on this icon{' '}
                      <RefreshCcw size={16} className="mx-1" />{' '}
                    </span>
                  )}{' '}
                  in order to initiate a retry and proceed with the upload
                  process.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <UploadForm
        handleUpload={handleUpload}
        cancelUpload={() => console.log('cancel')}
        countyUploadData={uploadCounty.fileData}
        isLoading={uploading}
        handleDropFiles={handleDrop}
        isDisabled={!!fileUpload.file}
      />

      {fileUpload?.file && (
        <motion.div variants={fadeIn} initial="hidden" animate="show">
          <motion.div variants={itemVariants} className="my-4">
            <UploadTable
              fileStatus={fileStatus}
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
