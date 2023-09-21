'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu';

import useUploadCounty from '@/hooks/useUploadCounty';
import useUploadProgressModal from '@/hooks/useUploadProgressModal';
import { FilesDBResponseData } from '@/types';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import axios from 'axios';
import { FileDown, Info, UploadCloud, X, XCircle } from 'lucide-react';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const data = row.original as FilesDBResponseData;
  const uploadProgressModal = useUploadProgressModal();
  const uploadCounty = useUploadCounty();
  const router = useRouter();

  const handleUpload = async () => {
    uploadCounty.setFileData(data);
    router.push(`/upload-multipart-2?county=${data.county}`);
  };

  const handleCancelUpload = () => {
    if (window.confirm('Do you really want to cancell it?')) {
      localStorage.setItem(`upload-fail-${data.id}`, data.uploadId);
      router.refresh();
    }
  };

  const handleShowProgressModal = () => {
    uploadProgressModal.setUploadId(data.uploadId);
    uploadProgressModal.onOpen();
  };

  const handleDeleteUpload = async () => {
    try {
      if (window.confirm('Do you really want to delete this file?')) {
        await axios.post('/api/delete-file', { id: data.id });
        router.refresh();
      }
    } catch (err) {
      toast.error('Error on remove this file');
      console.log(err);
    }
  };

  const handleDownloadFile = async () => {
    if (data.processStatus !== 'done') {
      alert('Please wait until the file is processed');
      return;
    }
    const response = await axios.post('/api/download-file', {
      fileName: data.file,
      folder: data.folder,
      isPublic: data.isPublic
    });

    window.location.href = response.data.signedUrl;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuItem onClick={handleDownloadFile}>
          Download
          <DropdownMenuShortcut>
            <FileDown size={16} className="text-gray-500" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShowProgressModal}>
          Info
          <DropdownMenuShortcut>
            <Info size={16} className="text-gray-500" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {data.status === 'rejected' && (
          <DropdownMenuItem onClick={handleUpload}>
            Upload file
            <DropdownMenuShortcut>
              <UploadCloud size={16} className="text-gray-500" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {data.status === 'uploading' &&
          !localStorage.getItem(`upload-fail-${data.id}`) && (
            <DropdownMenuItem onClick={handleCancelUpload}>
              Cancel Upload
              <DropdownMenuShortcut>
                <X size={16} className="text-gray-500" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        {typeof localStorage !== 'undefined' &&
          localStorage?.getItem(`upload-fail-${data.id}`) && (
            <>
              <DropdownMenuItem onClick={handleUpload}>
                Resume Upload
                <DropdownMenuShortcut>
                  <UploadCloud size={16} className="text-gray-500" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteUpload}>
                Delete Upload
                <DropdownMenuShortcut>
                  <XCircle size={16} className="text-gray-500" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
