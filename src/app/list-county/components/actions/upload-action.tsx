'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import useUploadCounty from '@/hooks/useUploadCounty';
import { FilesDBResponseData } from '@/types';
import { ImagePlusIcon } from 'lucide-react';

export default function UploadAction({ data }: { data: FilesDBResponseData }) {
  const uploadCounty = useUploadCounty();
  const router = useRouter();

  const handleUpload = async () => {
    uploadCounty.setFileData(data);
    router.push(`/uploads-preview?id=${data.id}`);
  };

  return (
    <Button
      size={'icon'}
      className="group bg-indigo-200 transition hover:bg-indigo-300"
      onClick={handleUpload}
    >
      <ImagePlusIcon className="text-indigo-600" />
    </Button>
  );
}
