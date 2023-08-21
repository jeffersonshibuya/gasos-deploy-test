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

export default function FilesPublicList({ files }: FilesListProps) {
  const router = useRouter();
  const [filesData, setFilesData] = useState<FilesDBResponseData[]>([]);

  useEffect(() => {
    setFilesData(files);
  }, [files]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Public Files" />
        <Button
          variant="outline"
          onClick={() => router.refresh()}
          size={'icon'}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className='my-4'>
        <FilesDataTable columns={filesColumns} data={filesData} />
      </div>
    </>
  );
}
