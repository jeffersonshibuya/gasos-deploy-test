'use client';

import DownloadAction from './actions/download-action';
import ResumeUploadAction from './actions/resume-upload-action';
import UploadAction from './actions/upload-action';
import UploadProgressAction from './actions/upload-progress-action';

import { countyStatuses, electionTypes } from '@/data/filesData';
import { FilesDBResponseData } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import { ColumnDef } from '@tanstack/react-table';

export const filesColumns: ColumnDef<FilesDBResponseData>[] = [
  {
    accessorKey: '#',
    header: '#',
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    }
  },
  // {
  //   accessorKey: 'file',
  //   header: 'File'
  // },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = countyStatuses.find(
        (status) => status.value === row.getValue('status')
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-full items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <div className="flex flex-col">
            <span>{row.original.status}</span>
            {typeof localStorage !== 'undefined' &&
              localStorage.getItem(`upload-fail-${row.original.id}`) && (
                <span>Failed</span>
              )}

            {row.original.status === 'rejected' && (
              <span>{row.original.reason}</span>
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
    // cell: ({ row }) => {
    //   return (
    //     <div className="flex w-full flex-col items-start">
    //       {localStorage.getItem('upload-fail') === row.original.uploadId ? (
    //         <span>Failed</span>
    //       ) : (
    //         <span>{row.original.status}</span>
    //       )}

    //       {row.original.status === 'rejected' && (
    //         <span className="block">{row.original.reason}</span>
    //       )}
    //     </div>
    //   );
    // }
  },
  {
    accessorKey: 'electionType',
    header: 'Election Type',
    cell: ({ row }) => {
      const electionType = electionTypes.find(
        (type) => type.value === row.getValue('electionType')
      );

      if (!electionType) {
        return null;
      }

      return (
        <div className="flex w-full items-center">
          <span>{electionType.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'year',
    header: 'Year',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      return (
        <time dateTime={row.original.created_at}>
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).format(new Date(Date.parse(row.original.created_at)))}
        </time>
      );
    }
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ row }) => {
      return <span>{formatBytes(row.original.size)}</span>;
    }
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end gap-2">
          {row.original.status === 'rejected' && (
            <UploadAction data={row.original} />
          )}
          {typeof localStorage !== 'undefined' &&
            localStorage?.getItem(`upload-fail-${row.original.id}`) && (
              <ResumeUploadAction data={row.original} />
            )}
          <UploadProgressAction data={row.original} />
          <DownloadAction data={row.original} />
        </div>
      );
    }
  }
];
