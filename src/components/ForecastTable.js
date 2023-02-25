import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { columnDefs as columnNames, getMasterData } from '../utils/dataParsing';
const ForecastTable = () => {
  const [rowData] = useState(getMasterData());

  const [columnDefs] = useState(columnNames);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
    </div>
  );
};

export default ForecastTable;
