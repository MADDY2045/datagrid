let excelHeaders = {
  Fiscal_weeks: [
    { week: 2, title: 'week 2 \n 2022' },
    { week: 3, title: 'week 3 \n 2022' },
    { week: 4, title: 'week 4 \n 2022' },
    { week: 5, title: 'week 5 \n 2022' },
    { week: 1, title: 'week 1 \n 2023' },
    { week: 2, title: 'week 2 \n 2023' },
    { week: 3, title: 'week 3 \n 2023' },
    { week: 1, title: 'week 1 \n 2024' },
    { week: 2, title: 'week 2 \n 2024' },
    { week: 3, title: 'week 3 \n 2024' },
  ],
};

let totalDemand = {
  'Total Demand 2022': [
    { week: 2, year: 2022, total: 100, title: 'week 2 \n 2022' },
    { week: 3, year: 2022, total: 200, title: 'week 3 \n 2022' },
    { week: 4, year: 2022, total: 0, title: 'week 4 \n 2022' },
    { week: 5, year: 2022, total: 0, title: 'week 5 \n 2022' },
    { week: 1, year: 2023, total: 0, title: 'week 1 \n 2023' },
    { week: 2, year: 2023, total: 100, title: 'week 2 \n 2023' },
    { week: 3, year: 2023, total: 200, title: 'week 3 \n 2023' },
    { week: 1, year: 2024, total: 0, title: 'week 1 \n 2024' },
    { week: 2, year: 2024, total: 100, title: 'week 2 \n 2024' },
    { week: 3, year: 2024, total: 200, title: 'week 3 \n 2024' },
  ],
  'Total Demand 2023': [
    { week: 2, year: 2022, total: 700, title: 'week 2 \n 2022' },
    { week: 3, year: 2022, total: 0, title: 'week 3 \n 2022' },
    { week: 4, year: 2022, total: 0, title: 'week 4 \n 2022' },
    { week: 5, year: 2022, total: 0, title: 'week 5 \n 2022' },
    { week: 1, year: 2023, total: 500, title: 'week 1 \n 2023' },
    { week: 2, year: 2023, total: 700, title: 'week 2 \n 2023' },
    { week: 3, year: 2023, total: 0, title: 'week 3 \n 2023' },
    { week: 1, year: 2024, total: 500, title: 'week 1 \n 2024' },
    { week: 2, year: 2024, total: 700, title: 'week 2 \n 2024' },
    { week: 3, year: 2024, total: 0, title: 'week 3 \n 2024' },
  ],
};

export const getMasterData = () => {
  let tempObj = {};
  let tempArray = [];
  Object.keys(totalDemand).map((key) => {
    totalDemand[key].map((item) => {
      tempObj = {
        ...tempObj,
        ['Fiscal_weeks']: [key],
        [item.title]: item['total'],
      };
    });
    tempArray.push(tempObj);
  });

  tempArray.push({
    ['Fiscal_weeks']: ['Total Demand 2022', 'Total Sales 2022'],
    'week 2 \n 2022': 700,
    'week 3 \n 2022': 0,
    'week 4 \n 2022': 0,
    'week 5 \n 2022': 0,
    'week 1 \n 2023': 500,
    'week 2 \n 2023': 700,
    'week 3 \n 2023': 0,
    'week 1 \n 2024': 500,
    'week 2 \n 2024': 700,
    'week 3 \n 2024': 0,
  });
  console.log('tempArray:::', tempArray);
  return tempArray;
};

export const columnDefs = () => {
  let tempColumnDef = [];
  Object.keys(excelHeaders).map((key) => {
    //tempColumnDef.push({ field: key });
    excelHeaders[key].forEach((item) => {
      tempColumnDef.push({ field: item['title'] });
    });
  });
  return tempColumnDef;
};

export function getData() {
  var rowData = [
    {
      orgHierarchy: ['Total Demand 2023'],
      week1: '100',
      week2: 'Permanent',
    },
    {
      orgHierarchy: ['Total Demand 2023', 'Sales 2023'],
      week1: 'Exec. Vice President',
      week2: 'Permanent',
    },

    {
      orgHierarchy: ['Total Demand 2023', 'Non base 2023'],
      week1: 'Director of Operations',
      week2: 'Permanent',
    },
    {
      orgHierarchy: ['Total Demand 2022'],
      week1: '100',
      week2: 'Permanent',
    },
    {
      orgHierarchy: ['Total Demand 2022', 'Sales 2022'],
      week1: 'Exec. Vice President',
      week2: 'Permanent',
    },

    {
      orgHierarchy: ['Total Demand 2022', 'Non base 2022'],
      week1: 'Director of Operations',
      week2: 'Permanent',
    },
  ];
  return rowData;
}

export const columnDef = [
  // we're using the auto group column by default!
  { field: 'week1' },
  { field: 'week2' },
];
