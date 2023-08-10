'use client';

import React from 'react';
import Select from 'react-select';

import { electionTypes } from '@/data/filesData';
import { SelectionDefaultType } from '@/types';

interface SelectElectionProps {
  handleSelectElection: ({ label, value }: SelectionDefaultType) => void;
  value: SelectionDefaultType;
}

export default function SelectElection({
  handleSelectElection,
  value
}: SelectElectionProps) {
  return (
    <>
      <Select
        options={electionTypes}
        value={value}
        onChange={(item) =>
          handleSelectElection(item || ({} as SelectionDefaultType))
        }
      />
    </>
  );
}
