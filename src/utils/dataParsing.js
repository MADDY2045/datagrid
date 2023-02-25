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
  'Sales 2022': [
    { week: 2, year: 2022, total: 10, title: 'week 2 \n 2022' },
    { week: 3, year: 2022, total: 20, title: 'week 3 \n 2022' },
    { week: 4, year: 2022, total: 0, title: 'week 4 \n 2022' },
    { week: 5, year: 2022, total: 0, title: 'week 5 \n 2022' },
    { week: 1, year: 2023, total: 0, title: 'week 1 \n 2023' },
    { week: 2, year: 2023, total: 10, title: 'week 2 \n 2023' },
    { week: 3, year: 2023, total: 20, title: 'week 3 \n 2023' },
    { week: 1, year: 2024, total: 0, title: 'week 1 \n 2024' },
    { week: 2, year: 2024, total: 10, title: 'week 2 \n 2024' },
    { week: 3, year: 2024, total: 2090, title: 'week 3 \n 2024' },
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
        ['Fiscal_weeks']: key,
        [item.title]: item['total'],
      };
    });
    tempArray.push(tempObj);
  });
  return tempArray;
};

export const columnDefs = () => {
  let tempColumnDef = [];
  let tempColId = [];
  Object.keys(excelHeaders).map((key) => {
    tempColumnDef.push({ type: 'header', text: key });
    tempColId.push({ columnId: key, width: 150 });
    excelHeaders[key].forEach((item) => {
      tempColumnDef.push({ type: 'header', text: item['title'] });
      tempColId.push({ columnId: item['title'], width: 150 });
    });
  });
  console.log(tempColumnDef);
  return { tempColumnDef, tempColId };
};
