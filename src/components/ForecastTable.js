import React, { useState, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
//import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  columnDefs as columnNames,
  getMasterData,
  getData,
  columnDef,
} from '../utils/dataParsing';
const ForecastTable = () => {
  const gridRef = useRef();
  const [rowData] = useState(getMasterData());

  const [columnDefs] = useState(columnNames);

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: 'Fiscal Weeks',
      minWidth: 300,
      cellRendererParams: {
        suppressCount: true,
      },
    };
  }, []);

  const getDataPath = useMemo(() => {
    return (data) => {
      return data['Fiscal_weeks'];
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        treeData={true}
        animateRows={true}
        groupDefaultExpanded={-1}
        getDataPath={getDataPath}
      ></AgGridReact>
    </div>
  );
};

export default ForecastTable;
