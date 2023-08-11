'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';

import useRejectModal from '@/hooks/useRejectModal';
import { FilesDBResponseData } from '@/types';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { Loader2, X } from 'lucide-react';

export default function RejectionAction({
  data
}: {
  data: FilesDBResponseData;
}) {
  const rejectModal = useRejectModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleRejectFile = async () => {
    // setIsLoading(true);
    // const response = await axios.post('/api/reject', {
    //   fileId,
    //   folder,
    //   fileName
    // });
    // if (response.data.$metadata.httpStatusCode !== 200) {
    //   toast.error('Something went wrong. Please try again in a few minutes');
    // } else {
    //   toast.success('File Aprroved');
    // }
    // router.refresh();
    // setIsLoading(false);
  };

  const handleReason = () => {
    rejectModal.onOpen(data);
  };

  return (
    <Button
      size={'icon'}
      className="group bg-red-200 hover:bg-red-400"
      onClick={handleReason}
      disabled={isLoading}
    >
      {!isLoading ? (
        <X className="h-5 w-5 text-red-700 group-hover:text-red-900" />
      ) : (
        <Loader2 className="animate-spin text-neutral-800" />
      )}
    </Button>
  );
}
