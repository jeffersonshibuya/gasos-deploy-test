'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { ImagePlusIcon, RefreshCcw } from 'lucide-react';

export default function TableHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        size={'sm'}
        className="secondary group flex h-10 gap-1 bg-primary font-semibold text-white transition hover:bg-primary/80"
        onClick={() => router.push('/upload-multipart-2')}
      >
        <ImagePlusIcon className="text-white" size={18} />
        Upload
      </Button>
      <Button variant="outline" onClick={() => router.refresh()} size={'icon'}>
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
