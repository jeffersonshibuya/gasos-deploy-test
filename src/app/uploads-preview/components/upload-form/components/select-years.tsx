'use client';

import React from 'react';
import Select from 'react-select';

import { SelectionDefaultType } from '@/types';

const currentYear = new Date().getFullYear();

const options: SelectionDefaultType[] = [];
for (let i = 0; i < 4; i++) {
  options.push({
    value: String(currentYear - i),
    label: String(currentYear - i)
  });
}

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
        options={options}
        value={value}
        onChange={(item) => handleSelectYear(item || ({} as any))}
      />
    </>
  );
}
