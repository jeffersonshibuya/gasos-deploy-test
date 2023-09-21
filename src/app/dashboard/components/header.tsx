/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Select from 'react-select';

import { years } from '@/data/filesData';
import { SelectionDefaultType } from '@/types';

export default function Header() {
  const router = useRouter();

  const currentYear = new Date().getFullYear().toString();
  const [_, setYear] = useState({
    label: currentYear,
    value: currentYear
  });

  const handleSelectYear = (year: SelectionDefaultType) => {
    setYear(year);
    router.push(`/dashboard?year=${year.value}`);
  };

  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="flex items-center gap-2 space-x-2 font-semibold">
        Year:
        <Select
          className="font-semibold text-primary"
          isSearchable={false}
          isClearable={false}
          defaultValue={years()[0]}
          options={years()}
          onChange={(item: any) => handleSelectYear(item)}
        />
      </div>
    </div>
  );
}
