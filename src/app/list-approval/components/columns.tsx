/* eslint-disable prettier/prettier */
'use client';

import ApprovalAction from './actions/approval-action';
import DownloadAction from './actions/download-action';
import ProcessingAction from './actions/processing-action';
import RejectionAction from './actions/rejection-action';
import StatusHistoryAction from './actions/status-history-action';
import UnpublishAction from './actions/unpublish-action';

import { counties, electionTypes, statuses } from '@/data/filesData';
import { cn } from '@/lib/utils';
import { FilesDBResponseData } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import { formatStatus } from '@/utils/format-status';
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
    accessorKey: 'county',
    header: 'County',
    cell: ({ row }) => {
      const county = counties.find(
        (county) => county.value === row.getValue('county')
      );

      if (!county) {
        return null;
      }

      return (
        <div className="flex w-full items-center">
          <span>{county.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'electionType',
    header: 'Election Type',
    cell: ({ row }) => {
      const item = electionTypes.find(
        (electionType) => electionType.value === row.getValue('electionType')
      );

      if (!item) {
        return null;
      }

      return (
        <div className="flex w-full items-center">
          <span>{item.label}</span>
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
    accessorKey: 'updated_at',
    header: 'Date',
    cell: ({ row }) => {
      return (
        row.original.updated_at && (
          <time dateTime={row.original.updated_at}>
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }).format(new Date(Date.parse(row.original.updated_at)))}
          </time>
        )
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
          <div
            className={cn(
              'flex flex-col font-semibold capitalize',
              formatStatus(row.original.status)
            )}
          >
            <span>{status.label}</span>
          </div>
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
          {row.original.processStatus === 'done'
            ? (
              <>
                {row.original.status === 'awaiting-approval' && (
                  <>
                    <ApprovalAction
                      id={row.original.id}
                      fileName={row.original.file}
                      folder={row.original.folder}
                    />
                    <RejectionAction data={row.original} />
                  </>
                )}

                {row.original.status === 'approved' && (
                  <UnpublishAction id={row.original.id} />
                )}

                <DownloadAction
                  fileName={row.original.file}
                  folder={row.original.folder}
                  isPublic={row.original.isPublic || false}
                />

                <StatusHistoryAction status_history={row.original.status_history} />
              </>
            ) : (
              <ProcessingAction />
            )
          }


        </div>
      );
    }
  }
];
