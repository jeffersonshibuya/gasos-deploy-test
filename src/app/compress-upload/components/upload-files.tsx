'use client';

import Heading from '@/components/Heading';

import DropzoneUpload from './DropzoneUpload';

export default function UploadFilesToCompress() {
  return (
    <div>
      <Heading title="Files to compress and upload" />

      <DropzoneUpload />
    </div>
  );
}
