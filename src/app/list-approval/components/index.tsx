/* eslint-disable prettier/prettier */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import EmptyState from '@/components/EmptyState';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';

import { filesColumns } from './columns';
import FilesDataTable from './data-table';

import { FilesDBResponseData, FilesResponseData, FilesResponseDataGrouped } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import axios from 'axios';
import { CornerDownRight, File, Folder, RefreshCcw } from 'lucide-react';

interface FilesListProps {
  files: FilesDBResponseData[];
}

export default function FilesListApproval({ files }: FilesListProps) {
  const router = useRouter();
  const [filesData, setFilesData] = useState<FilesDBResponseData[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const downloadImage = async (imageUrl: string, fileName: string) => {
    // Fetch the image as a Blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a new anchor element
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.style.display = 'none';

    // Append the anchor to the DOM
    document.body.appendChild(anchor);

    // Simulate a click event to trigger the download
    anchor.click();

    // Clean up
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const approveFile = async (folderName: string, fileName: string) => {
    setIsLoading(true);
    await axios.post('/api/approve', {
      folderName,
      fileName
    });
    setIsLoading(false);
    router.refresh();
  };

  useEffect(() => {
    setFilesData(files);
  }, [files]);

  if (filesData.length === 0) {
    return <EmptyState title="No files yet!" subtitle="No files uploaded" />;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Files Uploaded" />
        <Button
          variant="outline"
          onClick={() => router.refresh()}
          size={'icon'}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className='my-4'>
        <FilesDataTable columns={filesColumns} data={files} />
      </div>
    </>
  );
}
