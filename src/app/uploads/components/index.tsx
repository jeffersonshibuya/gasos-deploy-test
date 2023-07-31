'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';

import UploadDropArea from './upload-drop-area';
import { UploadTable } from './upload-table';

import axios, { AxiosResponse } from 'axios';

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

const controller = new AbortController();

export default function UploadsList() {
  const router = useRouter();

  const [uploads, setUploads] = useState<FileUploadProps[]>([]);

  const handleGetPresignedUrl = async (fileUpload: FileUploadProps) => {
    const response = await axios.post<{ signedUrl: string }>(
      '/api/upload-files',
      {
        fileName: fileUpload.folder + '/' + fileUpload.file.name,
        fileType: fileUpload.file.type
      }
    );

    return response.data.signedUrl || '';
  };

  const handleUpload = async () => {
    if (uploads.length > 0) {
      const responsePromises: Promise<AxiosResponse | null>[] = [];
      const startAt = Date.now();

      try {
        for (const fileUpload of uploads) {
          const signedUrl = await handleGetPresignedUrl(fileUpload);

          const responsePromise = axios
            .put(signedUrl, fileUpload.file, {
              signal: controller.signal,
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

        // All uploads completed successfully
        // toast.success('Upload successful');
        router.refresh();
        router.push('/list');
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
  };

  const handleChangeFolderName = (folderName: string, fileName: string) => {
    const fileUpload = uploads.filter(
      (fileUpload) => fileUpload.file.name === fileName
    )[0];

    fileUpload.folder = folderName;

    setUploads((state) => [...state]);
  };

  const cancelUpload = () => {
    controller.abort();
  };

  return (
    <>
      <UploadDropArea handleDropFiles={handleDropFiles} />
      <UploadTable
        uploads={uploads}
        handleUpload={handleUpload}
        handleRemoveFile={handleRemoveFile}
        cancelUpload={cancelUpload}
        handleChangeFolderName={handleChangeFolderName}
      />
    </>
  );
}
