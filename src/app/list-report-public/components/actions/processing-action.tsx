'use client';

import { PuffLoader } from 'react-spinners';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export default function ProcessingAction() {
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger>
          <PuffLoader size={30} color={'gray'} />
        </TooltipTrigger>
        <TooltipContent>
          <p>Processing</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
