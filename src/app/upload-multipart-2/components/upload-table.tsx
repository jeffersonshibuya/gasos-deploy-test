'use client';

import { Button } from '@/components/ui/button';
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

import { formatBytes } from '@/utils/format-bytes';
import { formatSecondsToMinutes } from '@/utils/format-seconds-to-minutes';
import {
  Ban,
  Check,
  Clock,
  File,
  Hourglass,
  Loader,
  RefreshCcw,
  Trash,
  X
} from 'lucide-react';

interface UploadTableProps {
  fileUpload: FileUploadProps;
  fileStatus: FileStatus;
  handleRemoveFile: (fileName: string) => void;
  handleResume: () => void;
  uploadProgress: number;
  bytesLoaded: number;
}

export function UploadTable({
  fileStatus,
  fileUpload,
  handleRemoveFile,
  uploadProgress,
  handleResume,
  bytesLoaded
}: UploadTableProps) {
  const loadStatusIcon = (fileStatus: FileStatus) => {
    switch (fileStatus) {
      case 'awaiting-approval':
        return <Check className="text-green-600" size={32} />;
      case 'canceled':
        return <Ban size={32} />;
      case 'loading':
        return <Loader className="animate-spin" size={32} />;
      case 'failed':
        return <X size={32} />;
      case 'pending':
        return <Hourglass size={32} />;
      default:
        return <X size={32} />;
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 60 }}></TableHead>
              <TableHead>Info</TableHead>
              <TableHead>File Data</TableHead>
              <TableHead>Upload Progress</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              // eslint-disable-next-line prettier/prettier
              className={`${fileStatus === 'awaiting-approval' && 'bg-green-500/10'}`}
            >
              <TableCell>
                <div className="text-neutral-500">
                  {loadStatusIcon(fileStatus)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1.5 text-lg text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <File className="h-6 w-6 text-indigo-500" />
                    {fileUpload.file.name}
                  </p>
                  <p className="flex items-center gap-2 text-sm font-bold capitalize">
                    {fileStatus}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-lg text-muted-foreground">
                  <span className="truncate">{fileUpload.file.name}</span>
                  <span className="flex gap-2 text-sm font-medium">
                    {formatBytes(bytesLoaded || 0)} of{' '}
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
                  <p className="text-sm font-semibold text-green-600">100%</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <Progress
                      max={100}
                      value={uploadProgress || 0}
                      className="transition-all"
                    />
                    <span className="text-md font-semibold text-green-700">
                      {Math.round(uploadProgress || 0)}%
                    </span>
                  </div>
                )}
                {/* upload.isUploading ? (
                    <Progress max={100} value={30} className="transition-all" />
                    ) : (
                    <div className="flex items-center font-medium">Error</div>) */}
              </TableCell>
              <TableCell className="text-right">
                {fileStatus !== 'loading' && (
                  <Button
                    variant={'ghost'}
                    onClick={() => handleRemoveFile(fileUpload.file.name)}
                    className="text-red-600"
                  >
                    <Trash size={18} />
                  </Button>
                )}
                {fileStatus === 'failed' && (
                  <Button
                    variant={'ghost'}
                    onClick={() => handleResume()}
                    className="text-indigo-600"
                  >
                    <RefreshCcw size={18} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
