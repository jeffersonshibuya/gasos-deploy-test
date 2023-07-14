'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import PreviewDialog from './PreviewDialog';

import { Search } from 'lucide-react';

interface ListFilesProps {
  files: {
    name: string;
    url: string;
  }[];
}

export default function ListFiles({ files }: ListFilesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  function onChange() {
    setIsOpen(!isOpen);
  }

  function previewImage(url: string) {
    setIsOpen(true);
    setImageUrl(url);
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Files Uploaded
            </h1>
            <p className="mt-2 text-sm text-gray-700">A list of all files</p>
          </div>
          {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add user
            </button>
          </div> */}
        </div>
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
      </div>
      <PreviewDialog isOpen={isOpen} onChange={onChange} imageUrl={imageUrl} />
    </>
  );
}
