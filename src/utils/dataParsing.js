export const rows = [
  { week1: '155', week2: '123.45', week3: '' },
  { week1: '912.55', week2: '567.88', week3: '' },
  { week1: '845.44', week2: '999', week3: '' },
];

export const columns = [
  { columnId: 'week1', width: 150 },
  { columnId: 'week2', width: 150 },
  { columnId: 'week3', width: 150 },
];

export const headerRow = {
  rowId: 'header',
  height: 40,
  cells: [
    { type: 'header', text: 'Week1' },
    { type: 'header', text: 'week2' },
    { type: 'header', text: 'week3' },
  ],
};

export const getRows = (flags) => [
  headerRow,
  ...flags.map((flag, idx) => ({
    rowId: idx,
    height: 60,
    cells: [
      { type: 'flag', text: flag.week1, nonEditable: flag.week1 == '912.55' },
      { type: 'flag', text: flag.week2, nonEditable: false },
      { type: 'text', text: flag.week3 },
    ],
  })),
];
