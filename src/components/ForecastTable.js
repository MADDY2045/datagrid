import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { weekData, masterData } from '../mock/mockData';
import { generateTableData } from '../utils/dataParsing';
import { ReactGrid } from '@silevis/reactgrid';
import { cloneDeep } from 'lodash';
import '@silevis/reactgrid/styles.css';

const ForecastTable = () => {
  const { weekData, masterData } = useSelector(
    (state) => state.initialApiReducer
  );
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState(null);

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

  const handleMasterContextMenu = (e) => {
    setData(e.target.childNodes[0].textContent);
  };
  const handleContextMenu = (
    selectedRowIds,
    selectedColIds,
    selectionMode,
    menuOptions
  ) => {
    let contextualMenu = {};
    //console.log("data::::", data);
    if (data === 'Fiscal_weeks') {
      contextualMenu = {
        id: 'Show All',
        label: 'Show All',
        handler: () => {
          setHiddenColumns([]);
        },
      };
    }

    if (data.includes('Week ')) {
      contextualMenu = {
        ...contextualMenu,
        id: 'Hide',
        label: 'Hide',
        handler: () => {
          //handle context menu
          setHiddenColumns((prev) => [...prev, data]);
        },
      };
    }
    menuOptions = [...menuOptions, contextualMenu];
    //}
    return menuOptions;
  };

  const applyChangesToPeople = (changes, prevPeople) => {
    changes.forEach((change) => {
      const personIndex = change.rowId;
      const fieldName = change.columnId;
      prevPeople[personIndex][fieldName] = change.newCell.text;
    });
    return [...prevPeople];
  };

  const handleChanges = (changes) => {
    const newRows = [...rows];
    changes.map((change) => {
      const changeRowIdx = rows.findIndex((el) => el.rowId === change.rowId);
      const changeColumnIdx = columns.findIndex(
        (el) => el.columnId === change.columnId
      );
      let clonedNewCell = cloneDeep(
        newRows[changeRowIdx].cells[changeColumnIdx]
      );
      let clonedNewCellText = clonedNewCell.text;
      //console.log("new row cell cloned::::::", clonedNewCellText);
      if (change.columnId === 'Fiscal_weeks') {
        newRows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        //setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
      }
      setRows(newRows);
    });
    //setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
  };

  return (
    <div>
      <div
        onContextMenu={(e) => handleMasterContextMenu(e)}
        style={{
          display: 'block',
          width: 'auto',
          overflow: 'auto',
        }}
      >
        <ReactGrid
          rows={rows}
          columns={columns.filter(
            (column) => !hiddenColumns.includes(column.columnId)
          )}
          onCellsChanged={handleChanges}
          onContextMenu={handleContextMenu}
          stickyLeftColumns={1}
          stickyTopRows={1}
          enableRangeSelection
          enableRowSelection
          enableFillHandle
          //initialFocusLocation={getInitialFocusLocation()}
        />
      </div>
    </div>
  );
};

export default ForecastTable;
