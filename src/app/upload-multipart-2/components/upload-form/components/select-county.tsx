'use client';

import React from 'react';
import Select from 'react-select';

import { counties } from '@/data/filesData';
import { SelectionDefaultType } from '@/types';

interface SelectYearsProps {
  handleSelectCounty: ({ label, value }: SelectionDefaultType) => void;
  value: SelectionDefaultType;
  isDisabled: boolean;
}

export default function SelectCounty({
  handleSelectCounty,
  value,
  isDisabled
}: SelectYearsProps) {
  return (
    <>
      <Select
        isClearable={false}
        isDisabled={isDisabled}
        options={counties}
        value={value}
        onChange={(item) => handleSelectCounty(item || ({} as any))}
      />
    </>
  );
}
