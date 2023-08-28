'use client';

import DownloadAction from './actions/download-action';

import { electionTypes } from '@/data/filesData';
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
    accessorKey: 'county',
    header: 'County',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
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
    accessorKey: 'size',
    header: 'Size',
    cell: ({ row }) => {
      return <span>{formatBytes(row.original.size)}</span>;
    }
  },
  {
    accessorKey: 'file',
    header: 'File',
    cell: ({ row }) => {
      return <span>{row.original.file}</span>;
    }
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end">
          <DownloadAction data={row.original} />
        </div>
      );
    }
  }
];
