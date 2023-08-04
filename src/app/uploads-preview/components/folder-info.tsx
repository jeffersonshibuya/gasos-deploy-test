import { FilePreviewData } from '@/types';
import { File, Folder } from 'lucide-react';

interface FolderInfoProps {
  folderData: FilePreviewData;
  folderHeader?: string;
}

export default function FolderInfo({
  folderData,
  folderHeader
}: FolderInfoProps) {
  return (
    <div className="">
      <div className="flex items-center gap-1">
        {folderHeader !== folderData.folder && (
          <>
            <Folder size={16} />
            {folderData.folder}
          </>
        )}
      </div>
      <ul className="pb-3">
        {typeof folderData.files !== 'string' &&
          folderData.files.map((item: string | FilePreviewData) =>
            typeof item !== 'string' && item.files ? (
              <div
                key={item.folder}
                className="ml-2 border-b border-dashed border-gray-300"
              >
                <FolderInfo folderData={item} />
              </div>
            ) : (
              <div
                className="mb-1 flex items-center gap-1 text-sm"
                key={String(item)}
              >
                {item && (
                  <>
                    <File size={14} />
                    <li className="text-neutral-700">{item.toString()}</li>
                  </>
                )}
              </div>
            )
          )}
      </ul>
    </div>
  );
}
