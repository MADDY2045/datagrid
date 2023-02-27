import React, { useState } from 'react';
import { ReactGrid, Column, Row } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import { rows, columns, getRows } from '../utils/dataParsing';
import FlagCellTemplate from './FlagCellTemplate';

const isMacOs = () => window.navigator.appVersion.indexOf('Mac') !== -1;

const ForecastTableTwo = () => {
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
    console.log('updated:::', updated);
    setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]);
    setCellChangesIndex(cellChangesIndex + 1);
    return updated;
  };

  const [rowMaster, setRowMaster] = useState(getRows(rows));
  const [cellChangesIndex, setCellChangesIndex] = useState(() => -1);
  const [cellChanges, setCellChanges] = useState(() => []);
  console.log('rowMaster::::', rowMaster);

  const handleChanges = (changes) => {
    console.log('changes::::', changes);
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

  return (
    <>
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
        columns={columns}
        onCellsChanged={(e) => handleChanges(e)} //might be useful for undo/redo
        customCellTemplates={{ flag: new FlagCellTemplate() }}
      />
      <button onClick={handleUndoChanges}>Undo</button>
      <button onClick={handleRedoChanges}>Redo</button>
    </>
  );
};

export default ForecastTableTwo;
