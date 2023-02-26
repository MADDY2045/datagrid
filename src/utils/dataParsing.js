export const rows = [
  { isoCode: 'swe' },
  { isoCode: 'deu' },
  { isoCode: 'mex' },
];

export const columns = [{ columnId: 'flag', width: 150 }];

export const headerRow = {
  rowId: 'header',
  height: 40,
  cells: [{ type: 'header', text: 'Flags' }],
};

export const getRows = (flags) => [
  headerRow,
  ...flags.map((flag, idx) => ({
    rowId: idx,
    height: 60,
    cells: [
      { type: 'flag', text: flag.isoCode, nonEditable: flag.isoCode === 'deu' },
    ],
  })),
];
