'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { BarLoader } from 'react-spinners';

import { FileUploadProps } from '@/app/uploads/components';

import FilesListTable from './FilesListTable';
import FolderForm from './folder-form';

import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileArchive, Folder } from 'lucide-react';

export default function DropzoneUpload() {
  const router = useRouter();

  const [uploads, setUploads] = useState<FileUploadProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');

  async function onDrop(acceptedFiles: File[]) {
    for await (const file of acceptedFiles) {
      if (
        uploads.filter((fileUpload) => fileUpload.file.name === file.name)
          .length === 0
      ) {
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
      } else {
        toast(`File ${file.name} is already selected`);
      }
    }
  }

  const handleUpload = async (fileNameForm: string, folderNameForm: string) => {
    if (uploads.length > 0) {
      setLoading(true);
      try {
        const formData = new FormData();
        setFolderName(folderNameForm);
        setFileName(fileNameForm);
        formData.append('folder', folderNameForm);
        formData.append('file', fileNameForm);
        for (const fileUpload of uploads) {
          formData.append('files', fileUpload.file);
        }

        const response = await axios.post('/api/compress-and-upload', formData);

        const res = await response.data;
        if (res.success) {
          toast.success(`${res.message}`);
          // clean uploads list
          setUploads([]);
          router.refresh();
          router.push('/list');
        } else {
          toast.error(`${res.message}`);
          console.error('Upload failed:', response);
        }
      } catch (error) {
        console.error('Upload failed', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveFilesIndex = async (filesIndex: number[]) => {
    const uploadsFiltered = [...uploads];

    const filteredFiles = uploadsFiltered.filter(
      (_, index) => !filesIndex.includes(index)
    );

    setUploads(filteredFiles);
  };

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

      <AnimatePresence>
        {uploads.length !== 0 && (
          <>
            {loading ? (
              <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <p>
                      <BarLoader
                        width={210}
                        className="w-32"
                        color={'blue'}
                        height={5}
                      />
                    </p>
                    <p className="text-sm leading-10 text-neutral-500">
                      <span className="pb-5 font-semibold">
                        Compressing and Uploading files
                      </span>
                      <div className="leading-6">
                        <span className="flex items-center gap-2">
                          <Folder className="h-4 w-4" /> Folder: {folderName}
                        </span>
                        <span className="flex items-center gap-2">
                          <FileArchive className="h-4 w-4" /> File: {fileName}
                        </span>
                      </div>
                    </p>
                  </div>
                </motion.div>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -70 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -70 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4"
                >
                  <FolderForm
                    isDisabled={loading || uploads.length === 0}
                    handleUpload={handleUpload}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 90 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, y: 90 }}
                >
                  <FilesListTable
                    files={uploads.map((f) => f.file)}
                    handleRemoveFilesIndex={handleRemoveFilesIndex}
                  />
                </motion.div>
              </>
            )}
          </>
        )}
      </AnimatePresence>

      {/* <FilesList files={uploads} /> */}
    </>
  );
}
