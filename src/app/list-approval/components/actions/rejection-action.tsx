'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import useRejectModal from '@/hooks/useRejectModal';
import { FilesDBResponseData } from '@/types';
import { X } from 'lucide-react';

export default function RejectionAction({
  data
}: {
  data: FilesDBResponseData;
}) {
  const rejectModal = useRejectModal();

  const handleReason = () => {
    rejectModal.onOpen(data);
  };

  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size={'icon'}
            className="group bg-red-200 hover:bg-red-400"
            onClick={handleReason}
          >
            <X className="h-5 w-5 text-red-700 group-hover:text-red-900" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reject</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
