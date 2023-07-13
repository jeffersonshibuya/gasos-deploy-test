import { FileData } from '@/types';
import {
  CheckCheck,
  FileWarning,
  FileWarningIcon,
  Hourglass,
  Loader,
  Trash2
} from 'lucide-react';

interface FilesListProps {
  files: FileData[];
  removeFileFromList: (filaName: string) => void;
}

export default function FilesList({
  files,
  removeFileFromList
}: FilesListProps) {
  if (files.length === 0) {
    return (
      <div
        className="mt-4 flex w-full items-center justify-center rounded 
        border border-dashed border-gray-300 py-6 font-semibold
        text-gray-500"
      >
        <p className="flex-col">
          <span className="flex items-center gap-2">
            <FileWarning size={18} />
            No files yet! <br />
          </span>
          <span className="text-xs">
            Please select the files or drag and drop
          </span>
        </p>
      </div>
    );
  }

  return (
    <>
      <ul
        role="list"
        className="mt-4 divide-y 
      divide-gray-200 rounded-md border border-gray-200"
      >
        {files.map((file) => (
          <li
            key={file.name}
            className="flex items-center 
          justify-between py-3 pl-3 pr-4 text-sm"
          >
            <div className="flex w-0 flex-1 items-center">
              {/* <Image
                width={120}
                height={90}
                src={file.preview}
                alt={'ballot-image'}
              /> */}
              {file.status === 'loading' ? (
                <Loader className="h-5 w-5 flex-shrink-0 animate-spin text-gray-400" />
              ) : file.status === 'waiting' ? (
                <Hourglass
                  size={18}
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                />
              ) : file.status === 'success' ? (
                <CheckCheck
                  size={18}
                  className="h-5 w-5 flex-shrink-0 text-green-800"
                />
              ) : (
                <FileWarningIcon
                  size={18}
                  className="h-5 w-5 flex-shrink-0 text-red-400"
                />
              )}
              <span className="ml-2 w-0 flex-1 truncate">{file.name}</span>
            </div>
            <div className="ml-4">
              {file.status !== 'success' && (
                <Trash2
                  size={18}
                  aria-label="remove-file"
                  className="cursor-pointer text-red-600 
              hover:text-red-700"
                  onClick={() => removeFileFromList(file.name)}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
