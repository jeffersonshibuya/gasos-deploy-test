'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import EmptyState from '@/components/EmptyState';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';

import { FilesDBResponseData } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import { CornerDownRight, File, Folder, RefreshCcw } from 'lucide-react';

interface FilesListProps {
  files: FilesDBResponseData[];
}

export default function FilesList({ files }: FilesListProps) {
  const router = useRouter();
  const [filesData, setFilesData] = useState<any[]>([]);

  useEffect(() => {
    setFilesData(files);
  }, [files]);

  if (filesData.length === 0) {
    return <EmptyState title="No files yet!" subtitle="No files uploaded" />;
  }

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
      {files.map((data) => {
        return (
          <div
            key={data.id}
            className="mt-2 border-b border-gray-200 bg-white py-2"
          >
            <>
              <div className="text flex items-center gap-2">
                <Folder size={18} /> {data.folder}
              </div>
              <ul role="list" className="divide-y divide-gray-100">
                <li className="flex py-4">
                  <CornerDownRight className="text-neutral-500" size={18} />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="ml-2 min-w-0">
                      <div className="flex items-start gap-x-3">
                        <p className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-600">
                          <File size={16} />
                          {data.file}
                          <svg
                            viewBox="0 0 2 2"
                            className="h-0.5 w-0.5 fill-current"
                          >
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <p className="truncate capitalize">
                            {data.status || '-'}
                          </p>
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        <p className="whitespace-nowrap">
                          Last Update{' '}
                          {data.updated_at && (
                            <time dateTime={data.updated_at}>
                              {new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              }).format(new Date(Date.parse(data.updated_at)))}
                            </time>
                          )}
                        </p>
                        <svg
                          viewBox="0 0 2 2"
                          className="h-0.5 w-0.5 fill-current"
                        >
                          <circle cx={1} cy={1} r={1} />
                        </svg>
                        <p className="truncate">
                          Size: {formatBytes(data.size)}
                        </p>
                      </div>
                    </div>
                    <div className="">
                      <a
                        href={'data.url'}
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                      >
                        Download
                        <span className="sr-only">, {data.file}</span>
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </>
          </div>
        );
      })}
    </>
  );
}
