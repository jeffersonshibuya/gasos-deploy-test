export const electionTypes = [
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

export const years = () => {
  const currentYear = new Date().getFullYear();
  const options = [];
  for (let i = 0; i < 4; i++) {
    options.push({
      value: String(currentYear - i),
      label: String(currentYear - i)
    });
  }
  return options;
};

export const counties = () => {
  return [
    { value: 'county_1', label: 'County_1' },
    { value: 'county_2', label: 'County_2' },
    { value: 'county_3', label: 'County_3' },
    { value: 'county_4', label: 'County_4' },
    { value: 'county_5', label: 'County_5' }
  ];
};
