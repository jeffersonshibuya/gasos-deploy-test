'use client';

import { Button } from '@/components/ui/button';

import { Trash } from 'lucide-react';

export function DataTableRowActions() {
  return (
    <>
      <Button variant="ghost" className="flex h-8 w-8 p-0">
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete file</span>
      </Button>
    </>
  );
}
