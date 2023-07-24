'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
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
import FolderNameDialog from './folder-name-dialog';

import useUploadFolderModal from '@/hooks/useUploadFolderModal';
import { formatBytes } from '@/utils/format-bytes';
import { formatSecondsToMinutes } from '@/utils/format-seconds-to-minutes';
import { Label } from '@radix-ui/react-label';
import {
  Ban,
  Check,
  Clock,
  File,
  Folder,
  FolderEdit,
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
  const [showEditFolderName, setShowEditFolderName] = useState(false);

  const [fileNameSelected, setFileNameSelected] = useState('');
  const [folderNameSelected, setFolderNameSelected] = useState('');

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

  const handleEditFolderName = (fileName: string, folderName: string) => {
    setFileNameSelected(fileName);
    setFolderNameSelected(folderName);
    setShowEditFolderName(true);
  };

  const handleSaveFolder = (folderName: string) => {
    if (fileNameSelected && folderName) {
      handleChangeFolderName(folderName, fileNameSelected);
    }
    setShowEditFolderName(false);
    setFileNameSelected('');
  };

  const toggleFolderNameDialog = () => {
    setShowEditFolderName(!showEditFolderName);
  };

  return (
    <>
      <FolderNameDialog
        isOpen={showEditFolderName}
        toogleShowFolderDialog={toggleFolderNameDialog}
        handleSaveFolder={handleSaveFolder}
        folderName={folderNameSelected}
      />

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
                    <div className="flex flex-col items-start gap-1.5 text-zinc-800">
                      <p className="flex items-center gap-1">
                        <File className="h-4 w-4 text-indigo-500" />
                        {fileUpload.file.name}
                      </p>
                      <p className="flex items-center gap-1">
                        <Folder className="h-4 w-4 text-green-500" />
                        {fileUpload.folder}
                        <FolderEdit
                          className="h-4 w-4 cursor-pointer transition hover:text-blue-600"
                          onClick={() =>
                            handleEditFolderName(
                              fileUpload.file.name,
                              fileUpload.folder
                            )
                          }
                        />
                        {/* <Button
                          variant={'outline'}
                          size={'icon'}
                          className="h-6 w-6 text-indigo-400"
                          onClick={() =>
                            handleEditFolderName(
                              fileUpload.file.name,
                              fileUpload.folder
                            )
                          }
                        >
                           
                        </Button>*/}
                      </p>
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
