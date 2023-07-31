'use client';

import { columns } from './columns';
import { DataTable } from './data-table';

export default function FilesListTable({
  files,
  handleRemoveFilesIndex
}: {
  files: File[];
  handleRemoveFilesIndex: (filesIndex: number[]) => void;
}) {
  const handleRemoveFiles = (filesIndexToDelete: number[]) => {
    handleRemoveFilesIndex(filesIndexToDelete);
  };

  return (
    <>
      <div className="mx-auto py-8">
        <DataTable
          columns={columns}
          data={files}
          handleRemoveFiles={handleRemoveFiles}
        />
      </div>
    </>
  );
}
