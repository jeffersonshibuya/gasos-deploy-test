'use client';

import React from 'react';
import Select from 'react-select';

import { years } from '@/data/filesData';
import { SelectionDefaultType } from '@/types';

interface SelectYearsProps {
  handleSelectYear: ({ label, value }: SelectionDefaultType) => void;
  value: SelectionDefaultType;
  isDisabled: boolean;
}

export default function SelectYears({
  handleSelectYear,
  value,
  isDisabled
}: SelectYearsProps) {
  return (
    <>
      <Select
        isSearchable={false}
        isClearable={false}
        isDisabled={isDisabled}
        options={years()}
        value={value}
        onChange={(item) => handleSelectYear(item || ({} as any))}
      />
    </>
  );
}
