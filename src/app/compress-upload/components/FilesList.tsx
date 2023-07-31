import { useEffect } from 'react';

import { FileUploadProps } from '@/app/uploads/components';
import EmptyState from '@/components/EmptyState';
import { ScrollArea } from '@/components/ui/scroll-area';

import { formatBytes } from '@/utils/format-bytes';
import {
  CheckCheck,
  FileWarningIcon,
  Hourglass,
  Loader,
  Trash2
} from 'lucide-react';

interface FilesListProps {
  files: FileUploadProps[];
}

export default function FilesList({ files }: FilesListProps) {
  const totalBytes = files.reduce((total, prop) => total + prop.file.size, 0);
  const totalFiles = files.length;

  if (files.length === 0) {
    return (
      <EmptyState
        title="No files yet!"
        subtitle=" Please select the files or drag and drop"
      />
    );
  }

  return (
    <>
      Total Bytes: {formatBytes(totalBytes)}
      || Total Files Selected: {totalFiles}
      <ScrollArea className="h-[20vh] min-h-[200px] w-full rounded-md border">
        <ul
          role="list"
          className="mt-4 divide-y 
        divide-gray-200 "
        >
          {files.map((fileUpload, index) => (
            <li
              key={fileUpload.file.name}
              className="flex items-center 
            justify-between py-3 pl-3 pr-4 text-sm"
            >
              {index + 1} |File: {fileUpload.file.name} | Size{' '}
              {formatBytes(fileUpload.file.size)}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </>
  );
}
