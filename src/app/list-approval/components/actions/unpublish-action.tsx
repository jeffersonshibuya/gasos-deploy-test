'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';

import axios from 'axios';
import { Link2Off, Loader2 } from 'lucide-react';

interface UnpublishActionProps {
  id: string;
  fileName: string;
  folder: string;
}

export default function UnpublishAction({
  id,
  fileName,
  folder
}: UnpublishActionProps) {
  const router = useRouter();

  const [fileId, setFileId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUnpublishFile = async () => {
    setIsLoading(true);
    const response = await axios.post('/api/unpublish', {
      fileId,
      folder,
      fileName
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
  );
}
