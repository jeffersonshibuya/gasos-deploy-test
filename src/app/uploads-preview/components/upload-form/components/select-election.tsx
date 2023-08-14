'use client';

import React from 'react';
import Select from 'react-select';

import { electionTypes } from '@/data/filesData';
import { SelectionDefaultType } from '@/types';

interface SelectElectionProps {
  handleSelectElection: ({ label, value }: SelectionDefaultType) => void;
  value: SelectionDefaultType;
  isDisabled: boolean;
}

export default function SelectElection({
  handleSelectElection,
  value,
  isDisabled
}: SelectElectionProps) {
  return (
    <>
      <Select
        options={electionTypes}
        value={value}
        isDisabled={isDisabled}
        onChange={(item) =>
          handleSelectElection(item || ({} as SelectionDefaultType))
        }
      />
    </>
  );
}
