'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import axios from 'axios';
import { FolderDown } from 'lucide-react';

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
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size={'icon'}
            className="group bg-[#00A3B5] transition hover:bg-[#00A3B5]/80"
            onClick={handleDownloadFile}
          >
            <FolderDown className="text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
