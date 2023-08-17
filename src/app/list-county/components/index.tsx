/* eslint-disable prettier/prettier */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import EmptyState from '@/components/EmptyState';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';

import { filesColumns } from './columns';
import FilesDataTable from './data-table';

import useUploadCounty from '@/hooks/useUploadCounty';
import { FilesDBResponseData } from '@/types';
import { ImagePlusIcon, RefreshCcw } from 'lucide-react';

interface FilesListProps {
  files: FilesDBResponseData[];
}

export default function FilesCountyList({ files }: FilesListProps) {
  const router = useRouter();
  const uploadCounty = useUploadCounty()

  const [filesData, setFilesData] = useState<FilesDBResponseData[]>([]);

  const handleNewUpload = () => {
    const data = {} as FilesDBResponseData

    uploadCounty.setFileData({
      ...data,
      county: 'county_2'
    })

    router.push(`/uploads-preview?id=${'1'}`)
  }

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
        <div className='flex items-center gap-2'>
          <Button
            size={'sm'}
            className="group bg-indigo-200 transition hover:bg-indigo-300 flex gap-1 text-indigo-500 font-semibold"
            onClick={handleNewUpload}
          >
            <ImagePlusIcon className="text-indigo-600" size={18} />
            Upload
          </Button>
          <Button
            variant="outline"
            onClick={() => router.refresh()}
            size={'icon'}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className='my-4'>
        <FilesDataTable columns={filesColumns} data={files} />
      </div>
    </>
  );
}
