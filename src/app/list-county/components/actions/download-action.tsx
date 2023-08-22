'use client';

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
    <span
      className="group flex cursor-pointer items-center gap-2 transition hover:bg-gray-200"
      onClick={handleDownloadFile}
    >
      <FolderDown className="h-4 w-4 text-neutral-600" />
      Download
    </span>
  );
}
