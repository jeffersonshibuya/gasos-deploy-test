'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Heading from '../Heading';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import Modal from './Modal';

import useUploadProgressModal from '@/hooks/useUploadProgressModal';
import { FilesDBResponseData } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import axios from 'axios';

export default function UploadProgressModal() {
  const uploadProgressModal = useUploadProgressModal();
  const [fileData, setFileData] = useState<FilesDBResponseData>(
    {} as FilesDBResponseData
  );
  const [isLoading, setIsLoading] = useState(false);

  async function getFileData() {
    setIsLoading(true);
    const response = await axios.get('/api/check-file-progress', {
      headers: {
        uploadId: uploadProgressModal.uploadId
      }
    });

    setFileData(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (uploadProgressModal.uploadId) {
      getFileData();
    }
  }, [uploadProgressModal.uploadId]);

  const bodyContent = (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div className="flex flex-col gap-4">
          <Heading title="Status" />
          <div>{fileData.created_at}</div>
          <div>{fileData.updated_at}</div>
          <div>{fileData.status}</div>
          <div>{fileData.totalPartsUploaded}</div>
          <div>{fileData.totalChunks}</div>
        </div>
      )}
    </>
  );

  return (
    <Modal
      isOpen={uploadProgressModal.isOpen}
      title="File Status"
      // actionLabel="Save"
      onClose={uploadProgressModal.onClose}
      onSubmit={() => console.log('submit')}
      body={bodyContent}
    />
  );
}
