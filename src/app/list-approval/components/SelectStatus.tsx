'use client';

import Select from 'react-select';

export default function SelectStatus() {
  const options = [
    { value: 'waiting-approval', label: 'Waiting-Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <Select
      isSearchable={false}
      isClearable={false}
      options={options}
      isMulti
      onChange={(item) => console.log(item)}
    />
  );
}
