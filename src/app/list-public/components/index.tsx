'use client';

import { useState } from 'react';

import { filesColumns } from './columns';
import FilesDataTable from './data-table';
import FilesFilter from './filters';

import { FilesDBResponseData } from '@/types';
import axios from 'axios';

export default function FilesPublicList() {
  const [isLoading, setIsLoading] = useState(false);
  const [filesData, setFilesData] = useState<FilesDBResponseData[]>([]);

  async function handleSearchFiles(
    year: string,
    electionType: string,
    county: string
  ) {
    setIsLoading(true);
    const response = await axios.post<FilesDBResponseData[]>(
      '/api/files-filter',
      {
        year,
        electionType,
        county
      }
    );

    setFilesData(response.data);
    setIsLoading(false);
  }

  return (
    <>
      <div className="my-1 space-y-4">
        <FilesFilter
          isLoading={isLoading}
          handleSearchFiles={handleSearchFiles}
        />
        <FilesDataTable columns={filesColumns} data={filesData} />
      </div>
    </>
  );
}
