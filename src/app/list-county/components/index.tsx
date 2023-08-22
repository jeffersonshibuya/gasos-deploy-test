/* eslint-disable prettier/prettier */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';

import { filesColumns } from './columns';
import FilesDataTable from './data-table';

import { counties } from '@/data/filesData';
import useUploadCounty from '@/hooks/useUploadCounty';
import { FilesDBResponseData } from '@/types';
import axios from 'axios';
import { ImagePlusIcon, RefreshCcw } from 'lucide-react';

interface FilesListProps {
  files: FilesDBResponseData[];
}

export default function FilesCountyList({ files }: FilesListProps) {
  const router = useRouter();
  const uploadCounty = useUploadCounty()

  const [filesData, setFilesData] = useState<FilesDBResponseData[]>([]);
  const [countySelected, setCountySelected] = useState('Polk')

  const handleNewUpload = () => {
    const data = {} as FilesDBResponseData

    uploadCounty.setFileData({
      ...data,
      county: countySelected
    })

    router.push(`/upload-multipart-2?county=${countySelected}`)
  }

  function handleChangeCounty(item: { label: string; value: string; }) {
    setFilesData(files.filter(file => file.county === item.value))
    setCountySelected(item.value)
  }

  function handleRefresh() {
    router.refresh()
  }

  useEffect(() => {
    if (countySelected) {
      setFilesData(files.filter(file => file.county === countySelected));
    }
  }, [files, countySelected]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`County Files - ${countySelected}`} />

        <div className='flex items-center gap-2'>
          <Select
            className='w-64'
            isClearable={false}
            options={counties}
            value={{ label: countySelected, value: countySelected }}
            onChange={(item) => handleChangeCounty(item as any)}
          />
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
            onClick={handleRefresh}
            size={'icon'}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className='my-4'>
        <FilesDataTable columns={filesColumns} data={filesData} />
      </div>
    </>
  );
}
