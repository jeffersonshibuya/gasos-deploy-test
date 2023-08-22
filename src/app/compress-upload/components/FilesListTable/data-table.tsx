/* eslint-disable prettier/prettier */
'use client';

import { useState } from 'react';


import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';


import DataTablePagination from './data-table-pagination';
import DataTableToolbar from './data-table-toolbar';

import { formatBytes } from '@/utils/format-bytes';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Database, Files, Trash } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleRemoveFiles: (files: number[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handleRemoveFiles
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleGetFilesSelectedIndex = () => {
    handleRemoveFiles(Object.keys(rowSelection).map(Number) as number[])
    setRowSelection({})
  }

  const files = [...data] as File[]
  const totalBytes = files.reduce((total, prop) => total + prop.size, 0);

  return (
    <>
      <div className='flex items-center justify-between'>
        <DataTableToolbar table={table} />
        <div className='text-sm text-neutral-600 font-semibold imtes-center flex gap-2'>
          <span className="flex items-center gap-1">
            <Files className='w-4 h-4' /> {data.length} Files
          </span>
          <span className='w-1 h-1 rounded-full bg-neutral-400 mt-2'></span>
          <span className="flex items-center gap-1">
            <Database className='w-4 h-4' /> {formatBytes(totalBytes)}
          </span>
        </div>
        <Button
          onClick={handleGetFilesSelectedIndex}
          disabled={Object.keys(rowSelection).length === 0}
          className='disabled:cursor-not-allowed items-center gap-1 bg-red-100 text-red-500'
          variant={'outline'}>
          <Trash className='w-4 h-4' />
          Delete {Object.keys(rowSelection).length > 0 && <span className='font-semibold'> {Object.keys(rowSelection).length}</span>}files
        </Button>
      </div >

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))
                  }
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div >
      <div className='py-4'>
        <DataTablePagination table={table} />
      </div>

    </>
  );
}
