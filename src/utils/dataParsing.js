export const rows = [
  { isoCode: 'swe', week2: 'week2' },
  { isoCode: 'deu', week2: 'week3' },
  { isoCode: 'mex', week2: 'week3' },
];

export const columns = [
  { columnId: 'flag', width: 150 },
  { columnId: 'flag2', width: 150 },
];

export const headerRow = {
  rowId: 'header',
  height: 40,
  cells: [
    { type: 'header', text: 'Flags' },
    { type: 'header', text: 'week2' },
  ],
};

export const getRows = (flags) => [
  headerRow,
  ...flags.map((flag, idx) => ({
    rowId: idx,
    height: 60,
    cells: [
      { type: 'flag', text: flag.isoCode, nonEditable: flag.isoCode === 'deu' },
      { type: 'flag', text: flag.week2, nonEditable: false },
    ],
  })),
];
