'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import TableHeader from './table-header';

import { counties, electionTypes, statuses, years } from '@/data/filesData';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export default function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex justify-between gap-5 rounded-lg bg-secondary px-2 py-4">
      <div className="flex flex-1 items-center space-x-2">
        <TableHeader />

        {table.getColumn('county') && (
          <DataTableFacetedFilter
            column={table.getColumn('county')}
            title="County"
            options={counties}
          />
        )}
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn('electionType') && (
          <DataTableFacetedFilter
            column={table.getColumn('electionType')}
            title="Election Type"
            options={electionTypes}
          />
        )}

        {table.getColumn('year') && (
          <DataTableFacetedFilter
            column={table.getColumn('year')}
            title="Year"
            options={years()}
          />
        )}
        {isFiltered && (
          <Button
            variant="default"
            onClick={() => table.resetColumnFilters()}
            className="h-10 bg-primary px-2 text-white lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-10 w-full md:w-[350px]"
        />
      </div>
    </div>
  );
}
