'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import useStatusHistoryModal from '@/hooks/useStatusHistoryModal';
import { StatusHistoryResponse } from '@/types';
import { FileClock } from 'lucide-react';

interface StatusHistoryActionProps {
  status_history: StatusHistoryResponse[];
}

export default function StatusHistoryAction({
  status_history
}: StatusHistoryActionProps) {
  const statusHistoryModal = useStatusHistoryModal();

  const handleShowStatusHistory = async () => {
    statusHistoryModal.onOpen(status_history);
  };

  return (
    <>
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger>
            <Button
              size={'icon'}
              className="group bg-neutral-500 hover:bg-neutral-600"
              onClick={handleShowStatusHistory}
            >
              <FileClock className="h-5 w-5 text-white group-hover:text-gray-100" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Status History</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
