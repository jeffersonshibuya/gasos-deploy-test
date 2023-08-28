/* eslint-disable prettier/prettier */
'use client';

import { useEffect, useState } from 'react';

import { filesColumns } from './columns';
import FilesDataTable from './data-table';

import { FilesDBResponseData } from '@/types';

interface FilesListProps {
  files: FilesDBResponseData[];
}

export default function FilesListApproval({ files }: FilesListProps) {
  const [filesData, setFilesData] = useState<FilesDBResponseData[]>([]);

  useEffect(() => {
    setFilesData(files);
  }, [files]);

  return (
    <>
      <div className="flex items-center justify-between">
        {/* <Heading title="Files Uploaded - State" /> */}
      </div >
      <div className='my-4'>
        <FilesDataTable columns={filesColumns} data={filesData} />
      </div>
    </>
  );
}
