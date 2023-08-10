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
      size={'icon'}
      className="group bg-neutral-200 transition hover:bg-neutral-300"
      onClick={handleDownloadFile}
    >
      <FolderDown className="text-neutral-600" />
    </Button>
  );
}
