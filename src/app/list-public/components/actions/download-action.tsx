'use client';

import { Button } from '@/components/ui/button';

import useDownloadModal from '@/hooks/useDownloadModal';
import { FilesDBResponseData } from '@/types';
import { FolderDown } from 'lucide-react';

export default function DownloadAction({
  data
}: {
  data: FilesDBResponseData;
}) {
  const downloadModal = useDownloadModal();

  const handleDownloadFile = async () => {
    downloadModal.onOpen(data);
  };

  return (
    <Button
      variant={'ghost'}
      className="group flex items-center gap-1 transition"
      onClick={handleDownloadFile}
    >
      <FolderDown className="h-4 w-4 text-neutral-600" />
      Download
    </Button>
  );
}
