'use client';

import React from 'react';
import Select from 'react-select';

import { SelectionDefaultType } from '@/types';

const options = [
  {
    value: 'Presidential Preference Primary',
    label: 'Presidential Preference Primary'
  },
  {
    value: 'Presidential Preference Primary and Special Election',
    label: 'Presidential Preference Primary and Special Election'
  },
  {
    value: 'General Primary and Nonpartisan Election',
    label: 'General Primary and Nonpartisan Election'
  },
  {
    value: 'General Primary and Nonpartisan Election Runoff',
    label: 'General Primary and Nonpartisan Election Runoff'
  },
  { value: 'General Election', label: 'General Election' },
  { value: 'General Election Runoff', label: 'General Election Runoff' },
  { value: 'Special Election', label: 'Special Election' },
  { value: 'Special Election Runoff', label: 'Special Election Runoff' },
  { value: 'General Municipal Election', label: 'General Municipal Election' },
  {
    value: 'General Municipal Election Runoff',
    label: 'General Municipal Election Runoff'
  }
];

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
        options={options}
        value={value}
        onChange={(item) =>
          handleSelectElection(item || ({} as SelectionDefaultType))
        }
      />
    </>
  );
}
