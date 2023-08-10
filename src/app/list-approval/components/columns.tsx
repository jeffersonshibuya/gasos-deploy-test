'use client';

import ApprovalAction from './actions/approval-action';
import DownloadAction from './actions/download-action';
import { statuses } from './data/statuses';

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
  {
    accessorKey: 'file',
    header: 'File'
  },
  {
    accessorKey: 'folder',
    header: 'Folder'
  },
  {
    accessorKey: 'updated_at',
    header: 'Date',
    cell: ({ row }) => {
      return (
        <time dateTime={row.original.updated_at}>
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).format(new Date(Date.parse(row.original.updated_at)))}
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = statuses.find(
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
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end gap-2">
          {row.original.status === 'waiting-approval' && (
            <ApprovalAction
              id={row.original.id}
              fileName={row.original.file}
              folder={row.original.folder}
            />
          )}
          <DownloadAction
            fileName={row.original.file}
            folder={row.original.folder}
            isPublic={row.original.isPublic || false}
          />
        </div>
      );
    }
  }
];
