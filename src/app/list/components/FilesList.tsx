'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';

import { FilesResponseData, FilesResponseDataGrouped } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import { CornerDownRight, File, Folder, RefreshCcw } from 'lucide-react';

interface FilesListProps {
  files: FilesResponseData[];
}

export default function FilesList({ files }: FilesListProps) {
  const router = useRouter();
  const [filesData, setFilesData] = useState<FilesResponseDataGrouped[]>([]);

  function groupAndConcatByFolder(
    arr: FilesResponseData[]
  ): FilesResponseDataGrouped[] {
    const result: FilesResponseDataGrouped = arr.reduce((acc: any, obj) => {
      const { name, ...rest } = obj;
      const [folder, filename] = obj.key.split('/');

      if (!acc[folder]) {
        acc[folder] = { isFile: filename ? false : true, files: [] };
      }

      acc[folder].files.push({ name, filename, ...rest });

      return acc;
    }, {});

    return Object.entries(result).map(([folder, value]) => ({
      folder,
      ...value
    }));
  }

  const downloadImage = async (imageUrl: string, fileName: string) => {
    // Fetch the image as a Blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a new anchor element
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.style.display = 'none';

    // Append the anchor to the DOM
    document.body.appendChild(anchor);

    // Simulate a click event to trigger the download
    anchor.click();

    // Clean up
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const resultList = groupAndConcatByFolder(files);
    setFilesData(resultList);
  }, [files]);

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
      {filesData.map((fileData) => {
        return (
          <div
            key={fileData.folder}
            className="mt-2 border-b border-gray-200 bg-white py-2"
          >
            {!fileData.isFile ? (
              <>
                <div className="text flex items-center gap-2">
                  <Folder size={18} /> {fileData.folder}
                </div>
                <ul role="list" className="divide-y divide-gray-100">
                  {fileData.files?.map((file) => (
                    <li key={file.key} className="flex py-4">
                      <CornerDownRight className="text-neutral-500" size={18} />
                      <div className="flex flex-1 items-center justify-between">
                        <div className="ml-2 min-w-0">
                          <div className="flex items-start gap-x-3">
                            <p className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-600">
                              <File size={16} />
                              {file.name}
                            </p>
                          </div>
                          <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                            <p className="whitespace-nowrap">
                              Last Update{' '}
                              <time dateTime={file.modified_at}>
                                {new Intl.DateTimeFormat('en-US', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }).format(
                                  new Date(Date.parse(file.modified_at))
                                )}
                              </time>
                            </p>
                            <svg
                              viewBox="0 0 2 2"
                              className="h-0.5 w-0.5 fill-current"
                            >
                              <circle cx={1} cy={1} r={1} />
                            </svg>
                            <p className="truncate">
                              Size: {formatBytes(file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="">
                          <a
                            href={file.url}
                            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                          >
                            Download
                            <span className="sr-only">, {file.name}</span>
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="ml-2 min-w-0">
                  <div className="flex items-start gap-x-3">
                    <p className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-600">
                      <File size={16} />
                      {fileData.files[0].name}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                    <p className="whitespace-nowrap">
                      Last Update{' '}
                      <time dateTime={fileData.files[0].modified_at}>
                        {new Intl.DateTimeFormat('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(
                          new Date(Date.parse(fileData.files[0].modified_at))
                        )}
                      </time>
                    </p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p className="truncate">
                      Size: {formatBytes(fileData.files[0].size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    downloadImage(fileData.files[0].url, fileData.files[0].name)
                  }
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
