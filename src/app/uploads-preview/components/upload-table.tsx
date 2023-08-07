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
  Pencil,
  Trash,
  Upload,
  X
} from 'lucide-react';

interface UploadTableProps {
  uploads: FileUploadProps[];
  // handleUpload: () => void;
  handleRemoveFile: (fileName: string) => void;
  handleChangeFolderName: (folderName: string, fileName: string) => void;
}

export function UploadTable({
  uploads,
  handleRemoveFile,
  handleChangeFolderName
}: UploadTableProps) {
  const [showEditFolderName, setShowEditFolderName] = useState(false);

  const [fileNameSelected, setFileNameSelected] = useState('');
  const [folderNameSelected, setFolderNameSelected] = useState('');

  const loadStatusIcon = (fileStatus: FileStatus) => {
    switch (fileStatus) {
      case 'completed':
        return <Check className="text-green-600" size={32} />;
      case 'canceled':
        return <Ban size={32} />;
      case 'loading':
        return <Loader className="animate-spin" size={32} />;
      case 'error':
        return <X className="animate-spin" size={32} />;
      case 'pending':
        return <Hourglass size={32} />;
      default:
        return <Paperclip size={32} />;
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 60 }}></TableHead>
              <TableHead style={{ width: 400 }}>Info</TableHead>
              <TableHead style={{ width: 'auto' }}>File Data</TableHead>
              <TableHead style={{ minWidth: 160 }}>Upload Progress</TableHead>
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
                    <div className="flex flex-col items-start gap-1.5 text-lg text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <File className="h-6 w-6 text-indigo-500" />
                        {fileUpload.file.name}
                      </p>
                      <p className="flex items-center gap-1">
                        <Folder className="h-6 w-6 text-green-500" />
                        {fileUpload.folder}
                        <Button
                          variant={'outline'}
                          size={'default'}
                          className="px-3 py-0.5 text-blue-700 hover:bg-blue-300 hover:text-white"
                        >
                          <Pencil
                            className="h-5 w-5"
                            onClick={() =>
                              handleEditFolderName(
                                fileUpload.file.name,
                                fileUpload.folder
                              )
                            }
                          />
                        </Button>
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-lg text-muted-foreground">
                      <span className="truncate">{fileUpload.file.name}</span>
                      <span className="flex gap-2 text-sm font-medium">
                        {formatBytes(fileUpload.sizeLoaded || 0)} of{' '}
                        {formatBytes(fileUpload.file.size)} |{' '}
                        {fileUpload.timeRamaining ? (
                          formatSecondsToMinutes(fileUpload.timeRamaining)
                        ) : (
                          <Clock size={18} />
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
                        <span className="text-md font-semibold text-green-700">
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
