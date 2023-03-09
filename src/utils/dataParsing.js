export const initialApiRow = [
  { header: 'TotalBase', week1: '155', week2: '123.45', week3: '100' },
  { header: 'Forecast', week1: '912.55', week2: '567.88', week3: '100' },
  { header: 'Promo', week1: '845.44', week2: '999', week3: '100' },
  { header: 'Total Demand', week1: '845.44', week2: '999', week3: '100' },
  { header: 'Non Base', week1: '845.44', week2: '999', week3: '100' },
  { header: 'Total Demand 2023', week1: '845.44', week2: '999', week3: '100' },
];

export function generateColumns(initialApiRow) {
  let tempObj = {};
  let tempArray = [];
  Object.keys(initialApiRow[0]).map((key, index) => {
    if (key === 'header') {
      tempObj = { columnId: key, width: 100, currentIndex: 'header' };
      tempArray.push(tempObj);
    } else {
      tempObj = { columnId: key, width: 100, currentIndex: index };
      tempArray.push(tempObj);
    }
  });
  return tempArray;
}

//console.log('initialApiRow:::::', generateColumns(initialApiRow));

// export const initialApicolumns = [
//   { columnId: 'header', width: 100, currentIndex: 'header' },
//   { columnId: 'week2', width: 100, currentIndex: 0 },
//   { columnId: 'week3', width: 100, currentIndex: 1 },
// ];

export function initialHeaderRow(columns) {
  let tempObj = {};
  let tempArray = [];
  columns.map((item) => {
    tempObj = { type: 'header', text: item.columnId };
    tempArray.push(tempObj);
  });
  return { rowId: 'header', height: 40, cells: tempArray };
}

// console.log(
//   'initialHeaderRow:::::::::::::',
//   initialHeaderRow(generateColumns(initialApiRow))
// );

// export const initialApiheaderRow = {
//   rowId: 'header',
//   height: 40,
//   cells: [
//     { type: 'header', text: 'header' },
//     { type: 'header', text: 'week1' },
//     { type: 'header', text: 'week2' },
//   ],
// };

export const getRows = (headerRow, columns, initialApiRow) => {
  console.log('initialApiRow inside??', initialApiRow);
  console.log('initialApiRow inside columns??', columns);
  let tempObj = {};
  let tempArray = [];
  initialApiRow.map((row, idx) => {
    console.log('each row::::', row);
    let text = columns.map((col) => {
      return { type: 'text', text: row?.[col['columnId']] };
    });
    console.log('text:::@@@@@@@@::', text);
    tempObj = { rowId: idx, height: 60, cells: [...text] };
    tempArray.push(tempObj);
  });
  console.log('tempArray::::', [headerRow, ...tempArray]);
  return [headerRow, ...tempArray];
  // return [
  //   headerRow,
  //   ...initialApiRow.map((row, idx) => ({
  //     rowId: idx,
  //     height: 60,
  //     cells: [
  //       { type: 'text', width: 100, text: row.header },
  //       { type: 'text', width: 100, text: row.week1, nonEditatble: false },
  //       { type: 'text', width: 100, text: row.week2, nonEditatble: false },
  //     ],
  //   })),
  // ];
};
