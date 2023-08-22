'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import useUploadCounty from '@/hooks/useUploadCounty';
import { FilesDBResponseData } from '@/types';
import { UploadCloud } from 'lucide-react';

export default function UploadAction({ data }: { data: FilesDBResponseData }) {
  const uploadCounty = useUploadCounty();
  const router = useRouter();

  const handleUpload = async () => {
    uploadCounty.setFileData(data);
    router.push(`/upload-multipart-2?county=${data.county}`);
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-1 rounded bg-indigo-500 p-1 text-xs text-white shadow-lg transition hover:bg-indigo-600"
      onClick={handleUpload}
    >
      <UploadCloud className="text-indigo-600" size={14} color="white" />
      Upload
    </div>
  );
}
