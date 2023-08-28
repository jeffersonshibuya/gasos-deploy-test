/* eslint-disable prettier/prettier */
'use client';

import { useEffect, useState } from 'react';

import { filesColumns } from './columns';
import FilesDataTable from './data-table';

import { FilesDBResponseData } from '@/types';
interface FilesListProps {
  files: FilesDBResponseData[];
}

export default function FilesCountyList({ files }: FilesListProps) {
  // const router = useRouter();
  // const uploadCounty = useUploadCounty()

  const [filesData, setFilesData] = useState<FilesDBResponseData[]>([]);
  const [countySelected, setCountySelected] = useState('Appling')

  // const handleNewUpload = () => {
  //   const data = {} as FilesDBResponseData

  //   uploadCounty.setFileData({
  //     ...data,
  //     county: countySelected
  //   })

  //   router.push(`/upload-multipart-2?county=${countySelected}`)
  // }

  function handleChangeCounty(item: { label: string; value: string; }) {
    setFilesData(files.filter(file => file.county === item.value))
    setCountySelected(item.value)
  }

  // function handleRefresh() {
  //   router.refresh()
  // }

  useEffect(() => {
    if (countySelected) {
      setFilesData(files.filter(file => file.county === countySelected));
    } else {
      setFilesData(files.filter(file => file.county === 'Appling'));
    }
  }, [countySelected, files]);

  return (
    <div className='my-4'>
      <FilesDataTable columns={filesColumns} data={filesData} countySelected={countySelected} handleChangeCounty={handleChangeCounty} />
    </div>
  );
}
