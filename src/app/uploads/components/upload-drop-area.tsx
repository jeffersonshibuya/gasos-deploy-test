'use client';

import Dropzone, { FileRejection } from 'react-dropzone';

interface UploadDropAreaProps {
  handleDropFiles: (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[]
  ) => void;
}

export default function UploadDropArea({
  handleDropFiles
}: UploadDropAreaProps) {
  return (
    <>
      <Dropzone
        onDrop={(acceptedFiles, fileRejections) =>
          handleDropFiles(acceptedFiles, fileRejections)
        }
        multiple
        accept={{ 'application/json': ['.zip'] }}
      >
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
    </>
  );
}
