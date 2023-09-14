'use client';

import { PuffLoader } from 'react-spinners';

import { DataTableRowActions } from './actions/data-table-row-actions';
import UploadAction from './actions/upload-action';

import { countyStatuses, electionTypes } from '@/data/filesData';
import { cn } from '@/lib/utils';
import { FilesDBResponseData } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import { formatStatus } from '@/utils/format-status';
import { ColumnDef } from '@tanstack/react-table';
import { Check } from 'lucide-react';

export const filesColumns: ColumnDef<FilesDBResponseData>[] = [
  {
    accessorKey: '#',
    header: '#',
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    }
  },
  {
    accessorKey: 'county',
    header: 'County'
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
    id: 'file',
    header: 'File',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="mr-2 font-semibold text-gray-600">
            {row.original.file}
          </span>
          <span className="text-sm text-gray-600">
            (original: {row.original.originalFile})
          </span>
        </div>
      );
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
    accessorKey: 'processStatus',
    header: 'Processing files',
    cell: ({ row }) => {
      return row.original.processStatus === 'done' ? (
        <Check />
      ) : (
        <span className="flex items-center gap-1 font-semibold">
          <PuffLoader size={28} />
          In Progress
        </span>
      );
    }
  },
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
          <div
            className={cn(
              'flex flex-col font-semibold capitalize',
              formatStatus(row.original.status)
            )}
          >
            <span>{row.original.status}</span>
            {typeof localStorage !== 'undefined' &&
              localStorage.getItem(`upload-fail-${row.original.id}`) && (
                <div className="flex items-center gap-2">
                  <span className="text-red-500">Failed</span>
                  <UploadAction data={row.original} />
                </div>
              )}

            {row.original.status === 'rejected' && (
              <div className="flex items-center gap-2">
                <span>Notes: {row.original.reason}</span>
                <UploadAction data={row.original} />
              </div>
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
