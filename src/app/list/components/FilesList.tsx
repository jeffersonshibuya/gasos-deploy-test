'use client';

import { useRouter } from 'next/navigation';

import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';

import { FilesResponseData } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import { File, Folder, RefreshCcw } from 'lucide-react';

interface FilesListProps {
  files: FilesResponseData[];
}

export default function FilesList({ files }: FilesListProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Files Uploaded" />
        <Button
          variant="outline"
          onClick={() => router.refresh()}
          size={'icon'}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      {files.map((file) => {
        const isFolder = file.key.split('/').length > 1;
        const fileName =
          file.key.split('/').length > 0 ? file.key.split('/')[0] : file.name;

        return (
          <div
            key={file.key}
            className="mt-2 border-b border-gray-200 bg-white py-2"
          >
            <div className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900">
              {isFolder ? <Folder /> : <File />}
              {fileName}
            </div>

            <ul role="list" className="divide-y divide-gray-100">
              <li
                key={file.name}
                className="flex items-center justify-between py-2"
              >
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-600">
                      {file.name}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                    <p className="whitespace-nowrap">
                      Last Update{' '}
                      {/* <time dateTime={project.dueDateTime}>{project.dueDate}</time> */}
                    </p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p className="truncate">Size: {formatBytes(file.size)}</p>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <a
                    href={file.url}
                    className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                  >
                    Download<span className="sr-only">, {file.name}</span>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        );
      })}
    </>
  );
}
