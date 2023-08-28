/* eslint-disable prettier/prettier */
'use client';

import Dropzone, { FileRejection } from 'react-dropzone';

interface UploadDropAreaProps {
  handleDropFiles: (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[]
  ) => void;
  isDisabled: boolean;
}

export default function UploadDropArea({
  handleDropFiles,
  isDisabled
}: UploadDropAreaProps) {
  return (
    <>
      <Dropzone
        onDrop={(acceptedFiles, fileRejections) =>
          handleDropFiles(acceptedFiles, fileRejections)
        }
        multiple={false}
        accept={{ 'application/json': ['.zip'] }}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={`${isDisabled && 'opacity-70 cursor-not-allowed bg-gray-50'} rounded-md order-2 mt-1 flex 
              cursor-pointer justify-center border border-dashed border-secondary px-6 
              pb-6 pt-5 transition duration-300 hover:bg-secondary/10
            `}
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
                  <span>Select file</span>

                  <input {...getInputProps()} aria-label="drop-input" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                Ballot Images in <strong> .zip </strong> format
              </p>
            </div>
          </div>
        )}
      </Dropzone>
    </>
  );
}
