'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';

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

    console.log(response.data);

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
    <Button
      size={'icon'}
      className="group bg-green-200 hover:bg-green-400"
      onClick={handleApproveFile}
      disabled={isLoading}
    >
      {!isLoading ? (
        <CheckCircledIcon className="h-5 w-5 text-green-700 group-hover:text-green-900" />
      ) : (
        <Loader2 className="animate-spin text-neutral-800" />
      )}
    </Button>
  );
}
