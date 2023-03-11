import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { weekData, masterData } from '../mock/mockData';
import { generateTableData } from '../utils/dataParsing';
import { ReactGrid } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';

const ForecastTable = () => {
  const { weekData, masterData } = useSelector(
    (state) => state.initialApiReducer
  );
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    console.log('weekData:', weekData);
    console.log('masterData:', masterData);
    const { rows, columns } = generateTableData(
      weekData,
      masterData,
      hiddenColumns
    );
    console.log('rows,columns', rows, columns);
    setRows(rows);
    setColumns(columns);
  }, [weekData, masterData, hiddenColumns]);

  return (
    <div>
      <ReactGrid
        rows={rows}
        columns={columns.filter(
          (column) => !hiddenColumns.includes(column.columnId)
        )}
        //onCellsChanged={handleChanges}
        //onContextMenu={handleContextMenu}
        stickyLeftColumns={1}
        stickyTopRows={1}
        enableRangeSelection
        enableRowSelection
        enableFillHandle
        //initialFocusLocation={getInitialFocusLocation()}
      />
    </div>
  );
};

export default ForecastTable;
