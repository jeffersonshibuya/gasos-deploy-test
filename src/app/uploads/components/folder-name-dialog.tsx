'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { Label } from '@radix-ui/react-label';

interface FolderNameProps {
  isOpen: boolean;
  folderName: string;
  toogleShowFolderDialog: () => void;
  handleSaveFolder: (folderName: string) => void;
}

export default function FolderNameDialog({
  isOpen,
  folderName,
  toogleShowFolderDialog,
  handleSaveFolder
}: FolderNameProps) {
  const [tempFolderName, setTempFolderName] = useState(folderName);

  const handleSaveNewFolder = () => {
    handleSaveFolder(tempFolderName);
  };

  useEffect(() => {
    setTempFolderName(folderName);
  }, [folderName]);

  return (
    <Dialog open={isOpen} onOpenChange={toogleShowFolderDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change folder name</DialogTitle>
          <DialogDescription>
            This will change the folder name which the file will be uploaded.
          </DialogDescription>
          <div className="grid grid-cols-4 items-center gap-4 pt-4">
            <Label htmlFor="name" className="text-right">
              Folder Name
            </Label>
            <Input
              id="name"
              required
              value={tempFolderName}
              onChange={(e) => setTempFolderName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={toogleShowFolderDialog} variant={'outline'}>
            Cancel
          </Button>
          <Button onClick={handleSaveNewFolder}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
