'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import FolderInfo from './folder-info';

import { FilePreviewData } from '@/types';
import { AlertCircle, Folder } from 'lucide-react';

interface FolderPreviewCardProps {
  folderData: FilePreviewData;
  isFolderValid: (folderData: FilePreviewData) => boolean;
}

export default function FolderPreviewCard({
  folderData,
  isFolderValid
}: FolderPreviewCardProps) {
  const isValid = isFolderValid(folderData);

  return (
    <Card
      // eslint-disable-next-line prettier/prettier
      className={`overflow-hidden ${!isValid && 'border-red-500 bg-red-50'} `}
    >
      <CardHeader>
        <CardTitle className="text-md flex items-center gap-2 border-b border-neutral-300 pb-2 text-neutral-600">
          <Folder size={18} />
          {folderData.folder}
        </CardTitle>
      </CardHeader>
      <CardContent className="my-2 h-60 max-h-60 overflow-y-auto scroll-smooth">
        <FolderInfo folderData={folderData} folderHeader={folderData.folder} />
      </CardContent>
      <CardFooter className="bg-gray-50">
        {isValid ? (
          <div className="text-sm text-blue-800">
            <strong>{folderData.files.length}</strong> Files
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle size={16} />
            Folder Invalid.
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
