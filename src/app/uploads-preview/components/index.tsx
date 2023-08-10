/* eslint-disable prettier/prettier */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { toast } from 'react-hot-toast';

import Loader from '@/components/Loader';

import FolderPreviewCard from './folder-preview-card';
import UploadDropArea from './upload-drop-area';
import UploadForm from './upload-form';
import { UploadTable } from './upload-table';

import { FilePreviewData } from '@/types';
import { fadeIn, itemVariants } from '@/utils/animation';
import axios, { AxiosResponse } from 'axios';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export type FileStatus =
  | 'pending'
  | 'loading'
  | 'completed'
  | 'canceled'
  | 'error';

export type FileUploadProps = {
  file: File;
  uploadProgress?: number | null;
  sizeLoaded?: number | null;
  timeRamaining?: number | null;
  status: FileStatus;
  folder: string;
};

export default function UploadsList() {
  const router = useRouter();

  const [uploads, setUploads] = useState<FileUploadProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorFolder, setShowErrorFolder] = useState(false);
  const [filesPreview, setFilesPreview] = useState<FilePreviewData[]>([]);
  const [abortController, setAbortController] = useState(new AbortController());

  const handleGetPresignedUrl = async (
    fileUpload: FileUploadProps,
    folder: string
  ) => {
    const response = await axios.post<{ signedUrl: string }>(
      '/api/upload-files',
      {
        fileName: folder + '/' + fileUpload.file.name,
        fileType: fileUpload.file.type
      }
    );

    return response.data.signedUrl || '';
  };

  const handleUpload = async (folder: string, year: string, electionType: string) => {
    if (abortController.signal.aborted) {
      setAbortController(new AbortController());
    }
    if (uploads.length > 0) {
      const responsePromises: Promise<AxiosResponse | null>[] = [];
      const startAt = Date.now();

      try {
        for (const fileUpload of uploads) {
          const signedUrl = await handleGetPresignedUrl(fileUpload, folder);

          const responsePromise = axios
            .put(signedUrl, fileUpload.file, {
              signal: abortController.signal,
              onUploadProgress: (progressEvent) => {
                const loaded = progressEvent.loaded;
                const total = progressEvent.total || 100;
                const progress = progressEvent.progress || 0;

                const currentTime = Date.now();
                const elapsedTime = currentTime - startAt;
                const totalBytes = total;
                const remainingBytes = totalBytes - loaded;
                const uploadSpeed = loaded / elapsedTime; // bytes per millisecond
                const remainingTimeMilliseconds = remainingBytes / uploadSpeed; // milliseconds
                const remainingTimeSeconds = remainingTimeMilliseconds / 1000; // seconds

                const fileStatus = uploads.filter(
                  (u) => u.file.name === fileUpload.file.name
                )[0];
                fileStatus.uploadProgress = progress * 100;
                fileStatus.timeRamaining = remainingTimeSeconds;
                fileStatus.sizeLoaded = loaded;
                fileStatus.status = 'loading';

                if (loaded === total) {
                  fileStatus.status = 'completed';
                }

                setUploads((state) => [...state]);
              }
            })
            .catch((err) => {
              if (err.code === 'ERR_CANCELED') {
                toast('Upload process canceled', {
                  icon: '❌',
                  duration: 4000
                });

                // reset all files status not completed as canceled
                uploads.forEach((fileUpload) => {
                  if (fileUpload.status !== 'completed') {
                    fileUpload.sizeLoaded = 0;
                    fileUpload.timeRamaining = null;
                    fileUpload.uploadProgress = 0;
                    fileUpload.status = 'canceled';
                  }
                  setUploads((state) => [...state]);
                });
              } else {
                toast.error('Something went wrong. Please try again');
                console.log(err);
              }
              return null;
            });

          responsePromises.push(responsePromise);
        }

        await Promise.all(responsePromises);

        // Set status tagging to the file
        // await axios.put('/api/upload-files', {
        //   fileName: `${folder}/${uploads[0].file.name}`
        // });

        // Save info in DynamoDB table
        const fileData = uploads[0].file
        await axios.post('/api/save-file', {
          fileName: fileData.name,
          folder,
          size: fileData.size,
          year,
          electionType
        })

        // All uploads completed successfully
        // toast.success('Upload successful');

        if (!abortController.signal.aborted) {
          router.refresh();
          router.push('/list');
        }
      } catch (error) {
        console.error('Upload failed', error);
      }
    }
  };

  const handleDropFiles = async (
    acceptedFiles: File[],
    filesRejections: FileRejection[]
  ) => {
    for await (const file of acceptedFiles) {
      if (
        uploads.filter((fileUpload) => fileUpload.file.name === file.name)
          .length > 0
      ) {
        toast(`File ${file.name} is already selected`);
        return;
      }

      setUploads([]);
      setShowErrorFolder(false);

      const formData = new FormData();
      formData.append('file', file);
      setIsLoading(true);
      const zipFiles = await axios.post('/api/files-zip', formData);
      setIsLoading(false);
      setFilesPreview(zipFiles.data);

      setUploads((prevState) => {
        const uploadFiles = [...prevState];
        const newFile: FileUploadProps = {
          file,
          sizeLoaded: 0,
          timeRamaining: null,
          uploadProgress: 0,
          status: 'pending',
          folder: file.name.split('.')[0]
        };
        return [...uploadFiles, newFile];
      });
    }

    if (filesRejections.length > 0) {
      const errorsMessage: string[] = [];

      for await (const fileReject of filesRejections) {
        errorsMessage.push(`File ${fileReject.file.name} is invalid`);
      }

      toast.custom((t) => (
        <div
          // eslint-disable-next-line prettier/prettier
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
          pointer-events-auto flex w-full max-w-md rounded-lg 
          bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
        >
          <div className="w-0 flex-1 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Files Rejected
                </p>
                <ul>
                  {errorsMessage?.map((errorMessage) => (
                    <li
                      className="mt-1 text-sm text-gray-500"
                      key={errorMessage}
                    >
                      {errorMessage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ));
    }
  };

  const handleRemoveFile = (fileName: string) => {
    const uploadsFilter = uploads.filter((u) => u.file.name !== fileName);

    setUploads(uploadsFilter);
    setFilesPreview([]);
    setShowErrorFolder(false);
  };

  const handleChangeFolderName = (folderName: string, fileName: string) => {
    const fileUpload = uploads.filter(
      (fileUpload) => fileUpload.file.name === fileName
    )[0];

    fileUpload.folder = folderName;

    setUploads((state) => [...state]);
  };

  const cancelUpload = () => {
    abortController.abort();
  };

  const isFolderValid = (folderData: FilePreviewData): boolean => {
    let isValid = true;
    for (const item of folderData.files) {
      if (
        typeof item === 'object' &&
        Array.isArray(item.files) &&
        item.files.length > 0
      ) {
        isValid = false;
      }
    }

    if (!isValid) setShowErrorFolder(true);
    return isValid;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <UploadDropArea handleDropFiles={handleDropFiles} />

      {uploads.length > 0 && (
        <motion.div variants={fadeIn} initial="hidden" animate="show">
          <motion.div variants={itemVariants} className="my-4">
            {showErrorFolder ? (
              <div className="my-2 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Please make sure that the folder follows the rules:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul role="list" className="list-disc space-y-1 pl-5">
                        <li>
                          Inside each compressed county folder is 1 subfolder
                          for every precinct within the county{' '}
                        </li>
                        <li>Subfolders are not allowed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <UploadForm
                handleUpload={handleUpload}
                isFolderError={showErrorFolder}
                cancelUpload={cancelUpload}
              />
            )}
          </motion.div>
          <motion.div variants={itemVariants} className="my-4">
            <UploadTable
              uploads={uploads}
              handleRemoveFile={handleRemoveFile}
              handleChangeFolderName={handleChangeFolderName}
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="my-5 grid grid-cols-5 gap-2"
          >
            {filesPreview.map((folderData) => (
              <div key={folderData.folder}>
                <FolderPreviewCard
                  folderData={folderData}
                  isFolderValid={isFolderValid}
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
