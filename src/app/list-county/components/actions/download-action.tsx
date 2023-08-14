'use client';

import { Button } from '@/components/ui/button';

import useDownloadModal from '@/hooks/useDownloadModal';
import { FilesDBResponseData } from '@/types';
import axios from 'axios';
import { FolderDown } from 'lucide-react';

export default function DownloadAction({
  data
}: {
  data: FilesDBResponseData;
}) {
  const handleDownloadFile = async () => {
    const response = await axios.post('/api/download-file', {
      fileName: data.file,
      folder: data.folder,
      isPublic: data.isPublic
    });

    window.location.href = response.data.signedUrl;
  };

  return (
    <Button
      size={'icon'}
      className="group bg-neutral-200 transition hover:bg-neutral-300"
      onClick={handleDownloadFile}
    >
      <FolderDown className="text-neutral-600" />
    </Button>
  );
}
