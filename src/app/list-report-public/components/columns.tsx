/* eslint-disable prettier/prettier */
'use client';

import ApprovalAction from './actions/approval-action';
import DownloadAction from './actions/download-action';
import ProcessingAction from './actions/processing-action';
import RejectionAction from './actions/rejection-action';
import UnpublishAction from './actions/unpublish-action';

import { counties, electionTypes, statuses } from '@/data/filesData';
import { cn } from '@/lib/utils';
import { FilesReportPublicDBResponseData } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import { formatStatus } from '@/utils/format-status';
import { ColumnDef } from '@tanstack/react-table';

export const filesColumns: ColumnDef<FilesReportPublicDBResponseData>[] = [
  {
    accessorKey: '#',
    header: '#',
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    }
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    id: 'FullName',
    header: 'Name',
    cell: ({ row }) => {
      return <span> {row.original.lastName}, {row.original.firstName}</span>
    }
  },
  {
    id: 'organization',
    header: 'Organization',
    cell: ({ row }) => {
      return <span> {row.original.organization || '-'}</span>
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
    accessorKey: 'date_requested',
    header: 'Date Requested',
    cell: ({ row }) => {
      return (
        row.original.date_requested && (
          <time dateTime={row.original.date_requested}>
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }).format(new Date(Date.parse(row.original.date_requested)))}
          </time>
        )
      );
    }
  },
];
