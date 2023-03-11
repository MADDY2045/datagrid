import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { weekData, masterData } from '../mock/mockData';
import {
  generateTableData,
  getExpandedRows,
  getRows,
  buildTree,
} from '../utils/dataParsing';
import { ReactGrid } from '@silevis/reactgrid';
import { cloneDeep } from 'lodash';
import '@silevis/reactgrid/styles.css';
import { evaluate } from 'mathjs';

const ForecastTable = () => {
  const { weekData, masterData } = useSelector(
    (state) => state.initialApiReducer
  );
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [people, setPeople] = useState([]);
  const [columns, setColumns] = useState([]);
  const [headerRow, setHeaderRow] = useState({});
  const [rows, setRows] = useState([]);
  const [rowsToRender, setRowsToRender] = useState([]);
  const [tempColDef, setTempColDef] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('weekData:', weekData);
    console.log('masterData:', masterData);
    const { rows, columns, headerRow, singleRows, response, tempColDef } =
      generateTableData(weekData, masterData, hiddenColumns);
    console.log('rows,columns', rows, columns);
    setRows(singleRows);
    setPeople(response);
    setRowsToRender([headerRow, ...getExpandedRows(singleRows)]);
    setColumns(columns);
    setTempColDef(tempColDef);
    setHeaderRow(headerRow);
  }, []);

  const handleMasterContextMenu = (e) => {
    setData(e.target.childNodes[0].textContent);
  };

  useEffect(() => {
    if (hiddenColumns.length > 0) {
      console.clear();
      console.log('hiddenColumns:::', hiddenColumns);
      console.log('actual cols:::', columns);
      let columnsNew = cloneDeep([...columns]);
      let rowsNew = cloneDeep([...rowsToRender]);
      let lookUpIndex = columnsNew
        .filter((item) => hiddenColumns.includes(item.columnId))
        .map((ele) => ele.currentIndex)[0];
      let filteredCols = columnsNew.filter(
        (item) => !hiddenColumns.includes(item.columnId)
      );
      let filteredRows = rowsNew.map((item) => {
        if (item.rowId === 'header') {
          return {
            ...item,
            cells: item.cells.filter(
              (ele, index) => !hiddenColumns.includes(ele.text)
            ),
          };
        } else {
          return {
            ...item,
            cells: item.cells.filter(
              (ele, index) => !hiddenColumns.includes(ele.rowMappingColId)
            ),
          };
        }
      });
      console.log('filteredCols:::', filteredCols);
      setRowsToRender([...filteredRows]);
      setColumns([...filteredCols]);
      console.log('lookUpIndex', lookUpIndex);
      console.log('actual filteredRows:::', filteredRows);
    }
  }, [hiddenColumns]);

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

  function isValid(expr) {
    try {
      return evaluate(expr);
    } catch (e) {
      console.log('e:::::', e);
      return 'notvalid';
    }
  }

  const handleChanges = (changes) => {
    const newRows = [...rows];
    console.log('newRows:::', newRows);
    changes.map((change) => {
      console.log('change::::', change);
      const changeRowIdx = newRows.findIndex((el) => el.rowId === change.rowId);
      const changeColumnIdx = columns.findIndex(
        (el) => el.columnId === change.columnId
      );
      let clonedNewCell = cloneDeep(
        newRows[changeRowIdx].cells[changeColumnIdx]
      );
      let clonedNewCellText = clonedNewCell.text;
      //console.log("new row cell cloned::::::", clonedNewCellText);
      if (change.columnId === 'Fiscal_weeks') {
        console.log(newRows[changeRowIdx]);
        newRows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        setRowsToRender([headerRow, ...getExpandedRows(newRows)]);
        //setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
      } else {
        let prevText = change.newCell.text;
        //console.log("prevText:::::", prevText);
        let isValidMath = isValid(prevText);
        if (isValidMath === 'notvalid') return;
        if (isValidMath !== 'notvalid') {
          //console.log("isValidMath:::::", isValidMath);
          let textToBeUpdated = isValidMath?.textValue
            ? isValidMath?.textValue
            : isValidMath;
          //console.log("textToBeUpdated::::", textToBeUpdated);
          let parsedCloneNewCell = JSON.parse(clonedNewCellText);
          //console.log("parsedCloneNewCell::::", parsedCloneNewCell);
          parsedCloneNewCell.textValue = textToBeUpdated;
          //parsedCloneNewCell.textValue = textToBeUpdated;
          change.newCell.text = JSON.stringify(parsedCloneNewCell);
          //console.log("change.newCell.text:::after final", change.newCell.text);
          //console.log("prevText::::", result);
          console.log('after parsing:::', change.newCell.text);
          newRows[changeRowIdx].cells[changeColumnIdx] = {
            ...newRows[changeRowIdx].cells[changeColumnIdx],
            text: change.newCell.text,
          };
          setRowsToRender([headerRow, ...getExpandedRows(newRows)]);
          //setRows(newRows);
          setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
        }
      }
    });
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
          rows={rowsToRender}
          columns={columns}
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
