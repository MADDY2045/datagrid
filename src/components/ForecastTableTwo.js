import React from 'react';
import { ReactGrid, Column, Row } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import { rows, columns, getRows } from '../utils/dataParsing';
import FlagCellTemplate from './FlagCellTemplate';

const ForecastTableTwo = () => {
  const rowMaster = getRows(rows);
  console.log('rowMaster:::', rowMaster);
  return (
    <ReactGrid
      rows={rowMaster}
      columns={columns}
      onCellsChanged={(e) => console.log('eeee', e)} //might be useful for undo/redo
      customCellTemplates={{ flag: new FlagCellTemplate() }}
    />
  );
};

export default ForecastTableTwo;
