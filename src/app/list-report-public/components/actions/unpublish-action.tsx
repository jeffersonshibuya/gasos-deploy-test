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

import axios from 'axios';
import { Link2Off, Loader2 } from 'lucide-react';

interface UnpublishActionProps {
  id: string;
}

export default function UnpublishAction({ id }: UnpublishActionProps) {
  const router = useRouter();

  const [fileId, setFileId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUnpublishFile = async () => {
    setIsLoading(true);
    const response = await axios.post('/api/unpublish', {
      fileId
    });

    if (response.data.$metadata?.httpStatusCode !== 200) {
      toast.error('Something went wrong. Please try again in a few minutes');
    } else {
      toast.success('File Unpublished');
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
            className="group bg-orange-300 hover:bg-orange-400"
            onClick={handleUnpublishFile}
            disabled={isLoading}
          >
            {!isLoading ? (
              <Link2Off className="h-5 w-5 text-orange-700 group-hover:text-orange-900" />
            ) : (
              <Loader2 className="animate-spin text-neutral-800" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Unpublish</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
