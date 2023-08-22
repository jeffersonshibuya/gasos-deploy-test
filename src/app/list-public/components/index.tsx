/* eslint-disable prettier/prettier */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';

import { filesColumns } from './columns';
import FilesDataTable from './data-table';
import FilesFilter from './filters';

import { FilesDBResponseData } from '@/types';
import axios from 'axios';
import { RefreshCcw } from 'lucide-react';



export default function FilesPublicList() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [filesData, setFilesData] = useState<FilesDBResponseData[]>([]);

  async function handleSearchFiles(year: string, electionType: string, county: string) {
    setIsLoading(true)
    const response = await axios.post<FilesDBResponseData[]>(
      '/api/files-filter',
      {
        year,
        electionType,
        county
      }
    );

    setFilesData(response.data)
    setIsLoading(false)
  }

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
      <div className='my-4 space-y-4'>
        <FilesFilter isLoading={isLoading} handleSearchFiles={handleSearchFiles} />
        <FilesDataTable columns={filesColumns} data={filesData} />
      </div>
    </>
  );
}
