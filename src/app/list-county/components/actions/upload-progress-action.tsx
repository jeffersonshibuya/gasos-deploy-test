'use client';

import { Button } from '@/components/ui/button';

import useDownloadModal from '@/hooks/useDownloadModal';
import useUploadProgressModal from '@/hooks/useUploadProgressModal';
import { FilesDBResponseData } from '@/types';
import axios from 'axios';
import { FolderDown, Percent } from 'lucide-react';

export default function UploadProgressAction({
  data
}: {
  data: FilesDBResponseData;
}) {
  const uploadProgressModal = useUploadProgressModal();

  const handleShowProgressModal = () => {
    uploadProgressModal.setUploadId(data.uploadId);
    uploadProgressModal.onOpen();
  };

  return (
    <Button
      size={'icon'}
      className="group bg-neutral-200 transition hover:bg-neutral-300"
      onClick={handleShowProgressModal}
    >
      <Percent className="text-neutral-600" />
    </Button>
  );
}
