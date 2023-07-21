'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { FileStatus, FileUploadProps } from '.';

import useUploadFolderModal from '@/hooks/useUploadFolderModal';
import { formatBytes } from '@/utils/format-bytes';
import { formatSecondsToMinutes } from '@/utils/format-seconds-to-minutes';
import { Label } from '@radix-ui/react-label';
import {
  Ban,
  Check,
  Clock,
  Hourglass,
  Loader,
  Paperclip,
  Trash,
  Upload,
  X
} from 'lucide-react';

interface UploadTableProps {
  uploads: FileUploadProps[];
  handleUpload: () => void;
  handleRemoveFile: (fileName: string) => void;
  cancelUpload: () => void;
  handleChangeFolderName: (folderName: string, fileName: string) => void;
}

export function UploadTable({
  uploads,
  handleUpload,
  handleRemoveFile,
  cancelUpload,
  handleChangeFolderName
}: UploadTableProps) {
  const [showEditInput, setShowEditInput] = useState(false);
  const [tempFolderName, setTempFolderName] = useState('');
  const [tempFileName, setTempFileName] = useState('');

  const loadStatusIcon = (fileStatus: FileStatus) => {
    switch (fileStatus) {
      case 'completed':
        return <Check className="text-green-600" />;
      case 'canceled':
        return <Ban />;
      case 'loading':
        return <Loader className="animate-spin" />;
      case 'error':
        return <X className="animate-spin" />;
      case 'pending':
        return <Hourglass />;
      default:
        return <Paperclip />;
    }
  };

  const handleEditFolderName = (fileName: string) => {
    setTempFileName(fileName);
    setShowEditInput(true);
  };

  const handleSaveFolder = () => {
    handleChangeFolderName(tempFolderName, tempFileName);
    setShowEditInput(false);
    setTempFileName('');
    setTempFolderName('');
  };

  return (
    <>
      <Dialog
        open={showEditInput}
        onOpenChange={(value) => setShowEditInput(value)}
      >
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
                value={tempFolderName}
                onChange={(e) => setTempFolderName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowEditInput(false)} variant={'outline'}>
              Cancel
            </Button>
            <Button onClick={handleSaveFolder}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end gap-2 py-4">
        <Button
          className="gap-1"
          disabled={uploads.length === 0}
          variant="outline"
          onClick={handleUpload}
        >
          <Upload size={16} />
          Upload
        </Button>
        <Button
          className="gap-1"
          variant={'destructive'}
          onClick={cancelUpload}
          disabled={uploads.length === 0}
        >
          <X size={16} />
          Abort
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 60 }}></TableHead>
              <TableHead style={{ width: 340 }}>Title</TableHead>
              <TableHead style={{ width: 'auto' }}>File</TableHead>
              <TableHead style={{ minWidth: 140 }}>Upload</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploads.map((fileUpload, index) => {
              return (
                <TableRow
                  key={index}
                  // eslint-disable-next-line prettier/prettier
                  className={`${fileUpload.status === 'completed' && 'bg-green-500/10'}`}
                >
                  <TableCell>
                    <div className="text-neutral-500">
                      {loadStatusIcon(fileUpload.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      File: {fileUpload.file.name}
                      Folder: {fileUpload.folder}
                      <Button
                        onClick={() =>
                          handleEditFolderName(fileUpload.file.name)
                        }
                      >
                        Save
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span className="truncate">{fileUpload.file.name}</span>
                      <span className="flex gap-2 font-medium">
                        {formatBytes(fileUpload.sizeLoaded || 0)} of{' '}
                        {formatBytes(fileUpload.file.size)} |{' '}
                        {fileUpload.timeRamaining ? (
                          formatSecondsToMinutes(fileUpload.timeRamaining)
                        ) : (
                          <Clock size={13} />
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {fileUpload.uploadProgress === 100 ? (
                      <p className="text-sm font-semibold text-green-600">
                        100%
                      </p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Progress
                          max={100}
                          value={fileUpload.uploadProgress || 0}
                          className="transition-all"
                        />
                        <span className="text-xs font-semibold text-green-700">
                          {Math.round(fileUpload.uploadProgress || 0)}%
                        </span>
                      </div>
                    )}
                    {/* upload.isUploading ? (
                    <Progress max={100} value={30} className="transition-all" />
                    ) : (
                    <div className="flex items-center font-medium">Error</div>) */}
                  </TableCell>
                  <TableCell className="text-right">
                    {fileUpload.status !== 'loading' && (
                      <Button
                        variant={'ghost'}
                        onClick={() => handleRemoveFile(fileUpload.file.name)}
                        className="text-red-600"
                      >
                        <Trash size={18} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {/* {isUploadsEmpty && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No videos selected.
              </TableCell>
            </TableRow>
          )} */}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
