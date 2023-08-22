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
    <div
      className="group flex cursor-pointer items-center gap-1 text-blue-700 underline transition"
      onClick={handleShowProgressModal}
    >
      {/* <FolderDown className="h-4 w-4 text-neutral-600" /> */}
      Status
    </div>
  );
}
