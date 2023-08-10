'use client';

import React from 'react';
import Select from 'react-select';

import { years } from '@/data/filesData';
import { SelectionDefaultType } from '@/types';

interface SelectYearsProps {
  handleSelectYear: ({ label, value }: SelectionDefaultType) => void;
  value: SelectionDefaultType;
}

export default function SelectYears({
  handleSelectYear,
  value
}: SelectYearsProps) {
  return (
    <>
      <Select
        isSearchable={false}
        isClearable={false}
        options={years()}
        value={value}
        onChange={(item) => handleSelectYear(item || ({} as any))}
      />
    </>
  );
}
