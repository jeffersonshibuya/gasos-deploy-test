/* eslint-disable prettier/prettier */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';

import { filesColumns } from './columns';
import FilesDataTable from './data-table';

import { FilesDBResponseData } from '@/types';
import { ImagePlusIcon, RefreshCcw } from 'lucide-react';

interface FilesListProps {
  files: FilesDBResponseData[];
}

export default function FilesListApproval({ files }: FilesListProps) {
  const router = useRouter();
  const [filesData, setFilesData] = useState<FilesDBResponseData[]>([]);

  useEffect(() => {
    setFilesData(files);
  }, [files]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Files Uploaded - State" />
        <div className='flex items-center gap-2'>
          <Button
            size={'sm'}
            className="group bg-indigo-200 transition hover:bg-indigo-300 flex gap-1 text-indigo-500 font-semibold"
            onClick={() => router.push('/upload-multipart-2')}
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
      </div >
      <div className='my-4'>
        <FilesDataTable columns={filesColumns} data={filesData} />
      </div>
    </>
  );
}
