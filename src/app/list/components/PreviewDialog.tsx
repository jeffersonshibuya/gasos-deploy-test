'use client';

import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface PreviewDialogProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  imageUrl: string;
}

export default function PreviewDialog({
  isOpen,
  onChange,
  imageUrl
}: PreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="">
          <DialogTitle>Preview</DialogTitle>
        </DialogHeader>
        <div className="flex h-[80vh] flex-1 flex-col">
          <Image
            fill
            src={imageUrl}
            alt={'thumb image'}
            className="object-contain"
          />
        </div>
      </DialogContent>
      {/* <DialogContent>
        <DialogHeader>
          <DialogTitle>File Preview</DialogTitle>
        </DialogHeader>
        <div className="h-[70vh]">
          <Image fill src={imageUrl} alt={'thumb image'} />
        </div>
      </DialogContent> */}
    </Dialog>
  );
}
