'use client';

import { useState } from 'react';
import Dropzone from 'react-dropzone';

import FilesList from './FilesList';

import { api } from '@/services/api';
import { FileData } from '@/types';
import axios from 'axios';

export default function DropzoneUpload() {
  const [files, setFiles] = useState<FileData[]>([]);

  async function onDrop(acceptedFiles: File[]) {
    for await (const file of acceptedFiles) {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.onload = () => {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          binaryStr: reader.result,
          // preview: URL.createObjectURL(file),
          status: 'waiting'
        };

        if (files.filter((f) => f.name === file.name).length > 0) {
          alert('File already added!');
          return;
        }

        setFiles((state) => [...state, fileData]);
      };

      reader.readAsArrayBuffer(file);
    }
  }

  const handleUpload = async () => {
    for (const file of files) {
      changeFileStatus('loading', file.name);
      const responseUrl = await api.post(
        '/upload',
        {
          fileName: file.name
        },
        {
          headers: {
            'Content-Type': `application/json`
          }
        }
      );

      const uploadURL = responseUrl.data.body;

      const response = await axios({
        method: 'put',
        url: `${uploadURL}`,
        data: file.binaryStr,
        headers: { 'Content-Type': file.type }
      });

      if (response.status) {
        changeFileStatus('success', file.name);
      } else {
        changeFileStatus('error', file.name);
      }
    }

    const pendingFiles = files.filter((file) => file.status !== 'success');
    setFiles(pendingFiles);
  };

  function changeFileStatus(status: string, fileName: string) {
    const MyFile = files.filter((file) => file.name === fileName)[0];
    MyFile.status = status;
    setFiles((state) => [...state]);
  }

  function removeFileFromList(name: string) {
    const updatedFileList = files.filter((f) => f.name !== name);
    setFiles(updatedFileList);
  }

  return (
    <>
      <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles)} multiple>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="mt-1 flex cursor-pointer justify-center rounded-md 
              border-2  border-dashed border-gray-300 px-6 pb-6 pt-5 transition duration-300 hover:bg-gray-100"
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Select files</span>

                  <input {...getInputProps()} aria-label="drop-input" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                Ballot Images in <strong> jpge or tiff </strong> format
              </p>
            </div>
          </div>
        )}
      </Dropzone>

      <FilesList files={files} removeFileFromList={removeFileFromList} />

      <button onClick={handleUpload}>Upload Files</button>
    </>
  );
}
