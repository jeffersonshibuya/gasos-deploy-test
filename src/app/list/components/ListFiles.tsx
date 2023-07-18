'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import EmptyState from '@/components/EmptyState';
import Heading from '@/components/Heading';
import { Button } from '@/components/ui/button';

import PreviewDialog from './PreviewDialog';

import { RefreshCcw, Search } from 'lucide-react';

interface ListFilesProps {
  files: {
    name: string;
    url: string;
  }[];
}

export default function ListFiles({ files }: ListFilesProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function onChange() {
    setIsOpen(!isOpen);
  }

  function previewImage(url: string) {
    setIsOpen(true);
    setImageUrl(url);
  }

  const handleRefresh = async () => {
    setIsLoading(true);
    router.refresh();
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <div className="flex justify-between">
        <Heading title="Files Uploaded" />
        <Button variant={'outline'} onClick={handleRefresh}>
          <RefreshCcw size={18} className="text-indigo-700" />
        </Button>
      </div>
      {files.length === 0 ? (
        <EmptyState title="No files yet!" subtitle="" />
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="divide-x divide-gray-200">
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Preview
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {files?.map((file) => (
                    <tr key={file.name} className="divide-x divide-gray-200">
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                        <button onClick={() => previewImage(file.url)}>
                          <Search size={18} />
                        </button>
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        {file.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <PreviewDialog isOpen={isOpen} onChange={onChange} imageUrl={imageUrl} />
    </>
  );
}
