'use client';

import { useState } from 'react';

import Heading from '../Heading';
import { Button } from '../ui/button';
import Modal from './Modal';

import useUploadFolderModal from '@/hooks/useUploadFolderModal';
import { LogIn } from 'lucide-react';

export default function UploadFolderModal() {
  const uploadFolderModal = useUploadFolderModal();

  const [folderName, setFolderName] = useState('');

  const handleSubmit = () => {
    uploadFolderModal.handleSubmit(folderName);
    uploadFolderModal.onClose();
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Folder Name" subtitle="Change folder Name" />
      <form onSubmit={handleSubmit}>
        <input
          className="rounded border border-gray-300"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <Button variant={'default'} className="gap-2" type="submit">
          Save
          <LogIn size={16} />
        </Button>
      </form>
    </div>
  );

  const footerContent = <div className="mt-3 flex flex-col gap-4"></div>;

  return (
    <Modal
      isOpen={uploadFolderModal.isOpen}
      title="Save"
      // actionLabel="Continue"
      onClose={uploadFolderModal.onClose}
      onSubmit={() => console.log('submit')}
      body={bodyContent}
      footer={footerContent}
    />
  );
}
