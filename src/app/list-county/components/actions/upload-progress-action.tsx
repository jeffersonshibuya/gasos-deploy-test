'use client';

import useUploadProgressModal from '@/hooks/useUploadProgressModal';
import { FilesDBResponseData } from '@/types';

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
