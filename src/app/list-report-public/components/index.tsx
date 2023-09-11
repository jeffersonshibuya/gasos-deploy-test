/* eslint-disable prettier/prettier */
'use client';

import { useEffect, useState } from 'react';

import { filesColumns } from './columns';
import FilesDataTable from './data-table';

import { FilesReportPublicDBResponseData } from '@/types';

interface FilesListReportPublicProps {
  files: FilesReportPublicDBResponseData[];
}

export default function FilesListReportPublicReportPublic({ files }: FilesListReportPublicProps) {
  const [filesData, setFilesData] = useState<FilesReportPublicDBResponseData[]>([]);

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
