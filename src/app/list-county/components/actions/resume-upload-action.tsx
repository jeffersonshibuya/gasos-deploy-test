'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import useUploadCounty from '@/hooks/useUploadCounty';
import { FilesDBResponseData } from '@/types';
import { ImagePlusIcon } from 'lucide-react';

export default function ResumeUploadAction({
  data
}: {
  data: FilesDBResponseData;
}) {
  const uploadCounty = useUploadCounty();
  const router = useRouter();

  const handleUpload = async () => {
    uploadCounty.setFileData(data);
    router.push(`/upload-multipart-2?county=${data.county}`);
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
