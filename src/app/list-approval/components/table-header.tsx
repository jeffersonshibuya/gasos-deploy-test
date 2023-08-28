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
        className="group flex gap-1 bg-indigo-200 font-semibold text-indigo-500 transition hover:bg-indigo-300"
        onClick={() => router.push('/upload-multipart-2')}
      >
        <ImagePlusIcon className="text-indigo-600" size={18} />
        Upload
      </Button>
      <Button variant="outline" onClick={() => router.refresh()} size={'icon'}>
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
