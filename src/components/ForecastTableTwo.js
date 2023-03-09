import React, { useEffect, useState } from 'react';
import { ReactGrid } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import {
  initialApiRow,
  getRows,
  initialApiheaderRow,
  generateColumns,
  initialHeaderRow,
} from '../utils/dataParsing';
import { useSelector, useDispatch } from 'react-redux';
import { updateDummyRow } from '../actions/rowActions';
import { cloneDeep } from 'lodash';
import { isColumnHidden } from '../actions/rowActions';

const isMacOs = () => window.navigator.appVersion.indexOf('Mac') !== -1;

const ForecastTableTwo = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateDummyRow(initialApiRow));
  }, []);

  const [rowsNew, setRowsNew] = useState(initialApiRow);
  const originalData = useSelector((state) => state.updateRowReducer);
  const isColumnHiddenFlag = useSelector(
    (state) => state.isColumnHiddenReducer
  );
  console.log('originalData from reducer::::', originalData);
  console.log('isColumnHidden from reducer::::', isColumnHidden);
  const [columnsNew, setColumns] = useState(generateColumns(rowsNew));

  const [headerRowNew] = useState(initialHeaderRow(columnsNew));
  const [rowMaster, setRowMaster] = useState(
    getRows(headerRowNew, columnsNew, rowsNew)
  );
  const originalRow = cloneDeep([...initialApiRow]);
  //const [rowsDummy, setRowsDummy] = useState(initialApiRow);
  //const [columnsDummy, setColumnsDummy] = useState(columnsNew);

  useEffect(() => {
    console.log('triggering fresh call::::');
    let updatedColumns = generateColumns(rowsNew);
    let updatedHeaderRow = initialHeaderRow(updatedColumns);
    let finalPreparedRowData = getRows(
      updatedHeaderRow,
      updatedColumns,
      rowsNew
    );
    console.log('updatedColumns:::', updatedColumns);
    console.log('updatedHeaderRow:::', updatedHeaderRow);
    console.log('finalPreparedRowData:::', finalPreparedRowData);
    setColumns(updatedColumns);
    setRowMaster(finalPreparedRowData);
  }, [rowsNew]);

  const [cellChangesIndex, setCellChangesIndex] = useState(() => -1);
  const [cellChanges, setCellChanges] = useState(() => []);
  const [data, setData] = useState(null);

  const applyNewValue = (changes, prevRow, usePrevValue = false) => {
    changes.forEach((change) => {
      const rowIndex = change.rowId;
      const fieldName = change.columnId;
      const cell = usePrevValue ? change.previousCell : change.newCell;
      prevRow[rowIndex][fieldName] = cell.text;
    });
    return [...prevRow];
  };

  const applyChangesToPeople = (changes, prevRow) => {
    const updated = applyNewValue(changes, prevRow);
    //console.log('updated:::', updated);
    setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]);
    setCellChangesIndex(cellChangesIndex + 1);
    return updated;
  };

  const handleChanges = (changes) => {
    setRowMaster((prevRow) => applyChangesToPeople(changes, prevRow));
  };

  const undoChanges = (changes, prevRow) => {
    const updated = applyNewValue(changes, prevRow, true);
    setCellChangesIndex(cellChangesIndex - 1);
    return updated;
  };

  const redoChanges = (changes, prevRow) => {
    const updated = applyNewValue(changes, prevRow);
    setCellChangesIndex(cellChangesIndex + 1);
    return updated;
  };

  const handleUndoChanges = () => {
    if (cellChangesIndex >= 0) {
      setRowMaster((prevRow) =>
        undoChanges(cellChanges[cellChangesIndex], prevRow)
      );
    }
  };

  const handleRedoChanges = () => {
    if (cellChangesIndex + 1 <= cellChanges.length - 1) {
      setRowMaster((prevRow) =>
        redoChanges(cellChanges[cellChangesIndex + 1], prevRow)
      );
    }
  };

  const handleContextMenu = (
    selectedRowIds,
    selectedColIds,
    selectionMode,
    menuOptions
  ) => {
    //if (selectionMode === 'row') {
    console.log('data:::::', data);
    let contextualMenu = {};
    if (data === 'header' && isColumnHiddenFlag) {
      contextualMenu = {
        id: 'SHOW ALL',
        label: 'SHOW ALL',
        handler: () => {
          //restore the dummy row
          console.log('entered show all', originalData);
          //return;
          setRowsNew(originalRow);
          dispatch(isColumnHidden(false));
        },
      };
    }
    if (data !== 'header') {
      contextualMenu = {
        id: 'HIDE',
        label: 'HIDE',
        handler: () => {
          //check if data is not header
          if (data !== 'header') {
            //update row
            let newRows = cloneDeep([...rowsNew]);
            let filteredRows = newRows.filter((item) => {
              delete item[data];
              return item;
            });
            setRowsNew(filteredRows);
            dispatch(isColumnHidden(true));
          }
        },
      };
    }

    menuOptions = [...menuOptions, contextualMenu];
    //}
    return menuOptions;
  };

  const handleMasterContextMenu = (e) => {
    setData(e.target.childNodes[0].textContent);
  };
  return (
    <div onContextMenu={(e) => handleMasterContextMenu(e)}>
      <div
        onKeyDown={(e) => {
          if ((!isMacOs() && e.ctrlKey) || e.metaKey) {
            switch (e.key) {
              case 'z':
                handleUndoChanges();
                return;
              case 'y':
                handleRedoChanges();
                return;
            }
          }
        }}
      ></div>
      <ReactGrid
        rows={rowMaster}
        onContextMenu={handleContextMenu}
        columns={columnsNew}
        onCellsChanged={(e) => handleChanges(e)} //might be useful for undo/redo
      />
      <button onClick={handleUndoChanges}>Undo</button>
      <button onClick={handleRedoChanges}>Redo</button>
    </div>
  );
};

export default ForecastTableTwo;
