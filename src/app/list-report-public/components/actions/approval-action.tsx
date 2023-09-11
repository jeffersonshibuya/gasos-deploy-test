'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { CheckCircledIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface ApprovalActionProps {
  id: string;
  fileName: string;
  folder: string;
}

export default function ApprovalAction({
  id,
  fileName,
  folder
}: ApprovalActionProps) {
  const router = useRouter();

  const [fileId, setFileId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApproveFile = async () => {
    setIsLoading(true);
    const response = await axios.post('/api/approve', {
      fileId,
      folder,
      fileName
    });

    if (response.data.$metadata?.httpStatusCode !== 200) {
      toast.error('Something went wrong. Please try again in a few minutes');
    } else {
      toast.success('File Approved');
    }
    router.refresh();
    setIsLoading(false);
  };

  useEffect(() => {
    setFileId(id);
  }, [id]);

  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size={'icon'}
            className="group bg-secondary/80 hover:bg-secondary"
            onClick={handleApproveFile}
            disabled={isLoading}
          >
            {!isLoading ? (
              <CheckCircledIcon className="h-5 w-5 text-white" />
            ) : (
              <Loader2 className="animate-spin text-white" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Approve</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
