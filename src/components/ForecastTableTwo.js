import React from 'react';
import { ReactGrid, Column, Row } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import { columnDefs, getMasterData } from '../utils/dataParsing';

const ForecastTableTwo = () => {
  const { tempColumnDef, tempColId } = columnDefs();
  const response = getMasterData();
  const [people] = React.useState(response);
  console.log('people::::', people);

  const retrieveCells = (person) => {
    console.log('person:::>>>>>', person);
    let acc = [];
    tempColumnDef.map((key) => {
      let textValue = person?.[key['text']].toString();
      acc = [...acc, { type: 'text', text: textValue || '' }];
    });
    return acc;
  };

  const headerRow = {
    rowId: 'header',
    cells: tempColumnDef,
  };

  const getRows = (people) => [
    headerRow,
    ...people.map((person, idx) => ({
      rowId: idx,
      cells: retrieveCells(person),
    })),
  ];

  const rows = getRows(people);

  return <ReactGrid rows={rows} columns={tempColId} />;
};

export default ForecastTableTwo;
