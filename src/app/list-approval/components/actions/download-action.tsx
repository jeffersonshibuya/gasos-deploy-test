'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';

import { CheckCircledIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { FileDown, FolderDown, Loader2 } from 'lucide-react';

interface DownloadActionProps {
  folder: string;
  fileName: string;
  isPublic: boolean;
}

export default function DownloadAction({
  folder,
  fileName,
  isPublic
}: DownloadActionProps) {
  const [objectId, setObjectId] = useState({} as DownloadActionProps);

  const handleDownloadFile = async () => {
    const response = await axios.post('/api/download-file', {
      fileName: objectId.fileName,
      folder: objectId.folder,
      isPublic: objectId.isPublic
    });

    window.location.href = response.data.signedUrl;
  };

  useEffect(() => {
    setObjectId({
      fileName,
      folder,
      isPublic
    });
  }, [fileName, folder, isPublic]);

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