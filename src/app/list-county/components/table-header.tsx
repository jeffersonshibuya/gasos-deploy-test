'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Select from 'react-select';

import { Button } from '@/components/ui/button';

import { counties } from '@/data/filesData';
import useUploadCounty from '@/hooks/useUploadCounty';
import { FilesDBResponseData } from '@/types';
import { ImagePlusIcon, RefreshCcw } from 'lucide-react';

interface TableHeaderProps {
  countySelected: string;
  handleChangeCounty: (item: any) => void;
}

export default function TableHeader({
  countySelected,
  handleChangeCounty
}: TableHeaderProps) {
  const router = useRouter();
  const uploadCounty = useUploadCounty();

  const handleNewUpload = () => {
    const data = {} as FilesDBResponseData;

    uploadCounty.setFileData({
      ...data,
      county: countySelected
    });

    router.push(`/upload-multipart-2?county=${countySelected}`);
  };

  function handleRefresh() {
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        className="w-64"
        isClearable={false}
        options={counties}
        value={{ label: countySelected, value: countySelected }}
        onChange={(item) => handleChangeCounty(item as any)}
      />
      <Button
        size={'sm'}
        className="secondary group flex h-10 gap-1 bg-primary font-semibold text-white transition hover:bg-primary/80"
        onClick={handleNewUpload}
      >
        <ImagePlusIcon className="text-white" size={18} />
        Upload
      </Button>
      <Button variant="outline" onClick={handleRefresh} size={'icon'}>
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
