import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { weekData, masterData } from '../mock/mockData';
import {
  generateTableData,
  getExpandedRows,
  buildTree,
  getParticularRowData,
  getAnamolousTagging,
  getLockStatus,
  isCellFirstColumn,
  parentRowsOfAnotherRows,
  getParentId,
  getStyle,
  isEditable,
  colHeaderSequence,
} from '../utils/dataParsing';
import { ReactGrid } from '@silevis/reactgrid';
import { cloneDeep } from 'lodash';
import '@silevis/reactgrid/styles.css';
import { evaluate } from 'mathjs';
import { updateCellChanges, changeCellIndex } from '../actions/redoActions';

const isMacOs = () => window.navigator.appVersion.indexOf('Mac') !== -1;

const ForecastTable = () => {
  const dispatch = useDispatch();
  const cellChangesArray = useSelector((state) => state.redoReducer);
  const cellIndexChanges = useSelector((state) => state.incrementReducer);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const { weekData, masterData } = useSelector(
    (state) => state.initialApiReducer
  );
  const { columnsOp, headerRowOp, responseOp, tempColDefOp } =
    generateTableData(weekData, masterData, hiddenColumns);

  const [people, setPeople] = useState(responseOp);
  const [columns, setColumns] = useState(columnsOp);
  const [headerRow, setHeaderRow] = useState(headerRowOp);
  const [rows, setRows] = useState(
    buildTree(
      getRows(headerRow, people, tempColDefOp, hiddenColumns, masterData)
    )
  );
  console.log('entered here');
  const [rowsToRender, setRowsToRender] = useState([
    headerRow,
    ...getExpandedRows(rows),
  ]);
  const [data, setData] = useState(null);
  /* Buffer objects for handling show all*/
  const [tempRowsToRender, setTempRowsToRender] = useState(rowsToRender);
  const [tempColumns, setTempColumns] = useState(columns);
  /* utility to handle focused range selection */
  let reactGrid = useRef(null);
  const [focusedRange, setFocusedRange] = useState(null);
  let focusedRangeTwo = useRef(null);
  let prevSelectedRange = useRef(focusedRange);

  useEffect(() => {
    prevSelectedRange.current = focusedRange;
  }, [reactGrid]);

  const handleMasterContextMenu = (e) => {
    setData(e?.target?.childNodes[0]?.textContent);
  };

  useEffect(() => {
    if (hiddenColumns.length > 0) {
      let columnsNew = cloneDeep([...columns]);
      let rowsNew = cloneDeep([...rowsToRender]);
      let lookUpIndex = columnsNew
        .filter((item) => hiddenColumns.includes(item?.columnId))
        .map((ele) => ele?.currentIndex)?.[0];
      let filteredCols = columnsNew.filter(
        (item) => !hiddenColumns.includes(item?.columnId)
      );
      let filteredRows = rowsNew.map((item) => {
        if (item?.rowId === 'header') {
          return {
            ...item,
            cells: item?.cells.filter(
              (ele, index) => !hiddenColumns.includes(ele.text)
            ),
          };
        } else {
          return {
            ...item,
            cells: item?.cells.filter(
              (ele, index) => !hiddenColumns.includes(ele?.rowMappingColId)
            ),
          };
        }
      });
      let singleNewRows = cloneDeep([...rows]);
      let filteredSingleRows = singleNewRows.map((item) => {
        if (item.rowId === 'header') {
          return {
            ...item,
            cells: item?.cells.filter(
              (ele, index) => !hiddenColumns.includes(ele?.text)
            ),
          };
        } else {
          return {
            ...item,
            cells: item?.cells.filter(
              (ele, index) => !hiddenColumns.includes(ele?.rowMappingColId)
            ),
          };
        }
      });
      let filteredHeaderRow = cloneDeep(headerRow);
      function filterHeaderRow() {
        return filteredHeaderRow?.cells.filter(
          (item) => !hiddenColumns.includes(item?.text)
        );
      }
      filteredHeaderRow = { ...filteredHeaderRow, cells: filterHeaderRow() };
      setHeaderRow(filteredHeaderRow);
      setRowsToRender([...filteredRows]);
      setRows(filteredSingleRows);
      setColumns([...filteredCols]);
    }
  }, [hiddenColumns]);

  const handleContextMenu = (
    selectedRowIds,
    selectedColIds,
    selectionMode,
    menuOptions
  ) => {
    let contextualMenu = {};
    if (data && data === 'Fiscal_weeks' && hiddenColumns.length > 0) {
      contextualMenu = {
        id: 'Show All',
        label: 'Show All',
        handler: () => {
          setHiddenColumns([]);
          setRowsToRender(tempRowsToRender);
          setColumns(tempColumns);
        },
      };
    }

    if (data && data?.includes('Week ')) {
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

  const applyNewValue = (changes, prevPeople, usePrevValue = false) => {
    changes.forEach((change) => {
      let baseValue = rows[change.rowId]?.cells[0]?.['text'];
      let rowKey = change.columnId;
      let textValueToBeUpdated = usePrevValue
        ? change.previousCell
        : change.newCell;
      let dataIndex = people.findIndex(
        (item) => item?.['Fiscal_weeks'] === baseValue
      );
      if (dataIndex && dataIndex !== -1) {
        //let arr = [...people];
        prevPeople[dataIndex][rowKey] = textValueToBeUpdated.text;
        //setPeople(arr);
      }
    });
    return [...prevPeople];
  };

  const applyChangesToPeople = (changes, prevPeople) => {
    const updated = applyNewValue(changes, prevPeople);
    dispatch(updateCellChanges(changes));
    dispatch(changeCellIndex(1));
    return updated;
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
    const newRows = cloneDeep([...rows]);
    changes.map((change) => {
      const changeRowIdx = newRows.findIndex((el) => el.rowId === change.rowId);
      const changeColumnIdx = columns.findIndex(
        (el) => el.columnId === change.columnId
      );
      let clonedNewCell = cloneDeep(
        newRows[changeRowIdx].cells[changeColumnIdx]
      );
      let clonedNewCellText = clonedNewCell.text;
      if (change.columnId === 'Fiscal_weeks') {
        newRows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        setRowsToRender([headerRow, ...getExpandedRows(newRows)]);
        setTempRowsToRender([headerRow, ...getExpandedRows(newRows)]);
        setRows(newRows);
        setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
      } else {
        let prevText = change.newCell.text;
        let isValidMath = isValid(prevText);
        if (isValidMath === 'notvalid') return;
        if (isValidMath !== 'notvalid') {
          let textToBeUpdated = isValidMath?.textValue
            ? isValidMath?.textValue
            : isValidMath;
          let parsedCloneNewCell = JSON.parse(clonedNewCellText);
          parsedCloneNewCell.textValue = textToBeUpdated;
          change.newCell.text = JSON.stringify(parsedCloneNewCell);
          newRows[changeRowIdx].cells[changeColumnIdx] = {
            ...newRows[changeRowIdx].cells[changeColumnIdx],
            text: change.newCell.text,
          };
          setRowsToRender([headerRow, ...getExpandedRows(newRows)]);
          setTempRowsToRender([headerRow, ...getExpandedRows(newRows)]);
          setRows(newRows);
          setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
        }
      }
    });
  };

  const getInitialFocusLocation = () => {
    if (columns.length > 0) {
      return {
        rowId: 0,
        columnId: columns[54].columnId,
      };
    }
  };

  const undoChanges = (changes, prevPeople) => {
    const updated = applyNewValue(changes, prevPeople, true);
    const newRows = cloneDeep([...rows]);
    changes.forEach((change) => {
      const changeRowIdx = rows.findIndex((el) => el.rowId === change.rowId);
      const changeColumnIdx = columns.findIndex(
        (el) => el.columnId === change.columnId
      );
      newRows[changeRowIdx].cells[changeColumnIdx] = change.previousCell;
    });
    setRowsToRender([headerRow, ...getExpandedRows(newRows)]);
    setRows(buildTree(newRows));
    dispatch(changeCellIndex(-1));
    return updated;
  };

  const redoChanges = (changes, prevPeople) => {
    const updated = applyNewValue(changes, prevPeople);
    const newRows = [...rows];
    changes.forEach((change) => {
      const changeRowIdx = rows.findIndex((el) => el.rowId === change.rowId);
      const changeColumnIdx = columns.findIndex(
        (el) => el.columnId === change.columnId
      );
      newRows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
    });
    setRowsToRender([headerRow, ...getExpandedRows(newRows)]);
    setRows(buildTree(newRows));
    dispatch(changeCellIndex(1));
    return updated;
  };

  const handleUndoChanges = () => {
    if (cellIndexChanges >= 0) {
      setPeople((prevPeople) =>
        undoChanges(cellChangesArray[cellIndexChanges], prevPeople)
      );
    }
  };
  const handleRedoChanges = () => {
    if (cellIndexChanges + 1 <= cellChangesArray.length - 1) {
      setPeople((prevPeople) =>
        redoChanges(cellChangesArray[cellIndexChanges + 1], prevPeople)
      );
    }
  };

  function getRows(
    headerRow,
    initialApiRow,
    tempColDef,
    hiddenColumns,
    masterData
  ) {
    try {
      let returnArray = [];
      colHeaderSequence.map((value, idx) => {
        if (getParticularRowData(initialApiRow, value)[0]) {
          returnArray.push({
            rowId: idx,
            height: 40,
            cells: retrieveCells(
              getParticularRowData(initialApiRow, value)[0],
              value,
              tempColDef,
              hiddenColumns,
              masterData
            ),
          });
        }
      });
      return [...returnArray];
    } catch (error) {
      console.log('error in getRows', error);
    }
  }

  function retrieveCells(person, value, tempColDef, hiddenColumns, masterData) {
    let acc = [];
    try {
      tempColDef.map((key) => {
        let anamolousTag = getAnamolousTagging(
          value,
          key?.currentIndex,
          masterData
        );
        let lockStatus = getLockStatus(value, key?.currentIndex, masterData);
        let textValue = JSON.stringify({
          textValue: person?.[key?.['text']].toString(),
          anamolousTagValue: anamolousTag,
          lockStatus: lockStatus,
        });
        acc = [
          ...acc,
          isCellFirstColumn(key?.text)
            ? {
                type: 'chevron',
                rowMappingColId: key['text'],
                indent: 1,
                isExpanded: true,
                hasChildren: Object.keys(parentRowsOfAnotherRows).includes(
                  JSON.parse(textValue)?.textValue
                ),
                //id: textValue,
                parentId:
                  getParentId(JSON.parse(textValue).textValue) === -1
                    ? undefined
                    : getParentId(JSON.parse(textValue).textValue),
                text: JSON.parse(textValue).textValue || '',
                style:
                  key &&
                  person?.['Fiscal_weeks'] &&
                  getStyle(person?.['Fiscal_weeks'], key),
                //className: "maddy",
                renderer: (textValue) =>
                  renderCell(textValue, key, person?.['Fiscal_weeks']),
              }
            : {
                type: 'text',
                nonEditable: !(
                  isEditable(person?.['Fiscal_weeks']) &&
                  key?.['currentIndex'] >= 53
                ),
                rowMappingColId: key?.['text'],
                style:
                  key &&
                  person?.['Fiscal_weeks'] &&
                  getStyle(person?.['Fiscal_weeks'], key),
                className: 'maddy',
                text: textValue || '',
                renderer: (textValue) =>
                  renderCell(textValue, key, person?.['Fiscal_weeks']),
              },
        ];
      });
      return acc;
    } catch (e) {
      console.log('error::::::::::::::::::::::', e);
    }
  }

  function renderCell(text, key, header) {
    let actualText = JSON.parse(text).textValue;
    let anamolousTagValue = JSON.parse(text).anamolousTagValue;
    let lockStatus = JSON.parse(text).lockStatus;
    return (
      <>
        <>{actualText}</>
        <>
          <i
            style={{
              display: anamolousTagValue ? 'block' : 'none',
              //visibility: anamolousTag ? "visible" : "hidden",
              opacity: anamolousTagValue === 'null' ? 0 : 1,
              color: anamolousTagValue === 'PARTIAL' ? 'lightgray' : 'black',
            }}
            id={`${key.text}_${key.currentIndex}`}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => {
              if (anamolousTagValue === 'null') {
                tagAnamolous(
                  reactGrid,
                  rows,
                  setRowsToRender,
                  cellChangesArray,
                  dispatch,
                  cellIndexChanges,
                  focusedRangeTwo,
                  columns,
                  rowsToRender,
                  'TAG',
                  headerRow
                );
              }
              if (
                anamolousTagValue === 'PARTIAL' ||
                anamolousTagValue === 'FULL'
              ) {
                tagAnamolous(
                  reactGrid,
                  rows,
                  setRowsToRender,
                  cellChangesArray,
                  dispatch,
                  cellIndexChanges,
                  focusedRangeTwo,
                  columns,
                  rowsToRender,
                  'UNTAG',
                  headerRow
                );
              }
            }}
            onMouseOver={(e) => {
              if (anamolousTagValue == 'null') {
                e.target.style.opacity = 1;
              }
            }}
            onMouseLeave={(e) => {
              if (anamolousTagValue === 'null') {
                e.target.style.opacity = 0;
              }
            }}
            className="fa-solid fa-xmark anamolous-mark"
          ></i>
        </>
      </>
    );
  }

  function retrieveCells(person, value, tempColDef, hiddenColumns, masterData) {
    let acc = [];
    try {
      tempColDef.map((key) => {
        let anamolousTag = getAnamolousTagging(
          value,
          key?.currentIndex,
          masterData
        );
        let lockStatus = getLockStatus(value, key?.currentIndex, masterData);
        let textValue = JSON.stringify({
          textValue: person?.[key?.['text']].toString(),
          anamolousTagValue: anamolousTag,
          lockStatus: lockStatus,
        });
        acc = [
          ...acc,
          isCellFirstColumn(key?.text)
            ? {
                type: 'chevron',
                rowMappingColId: key['text'],
                indent: 1,
                isExpanded: true,
                hasChildren: Object.keys(parentRowsOfAnotherRows).includes(
                  JSON.parse(textValue)?.textValue
                ),
                //id: textValue,
                parentId:
                  getParentId(JSON.parse(textValue).textValue) === -1
                    ? undefined
                    : getParentId(JSON.parse(textValue).textValue),
                text: JSON.parse(textValue).textValue || '',
                style:
                  key &&
                  person?.['Fiscal_weeks'] &&
                  getStyle(person?.['Fiscal_weeks'], key),
                //className: "maddy",
                renderer: (textValue) =>
                  renderCell(textValue, key, person?.['Fiscal_weeks']),
              }
            : {
                type: 'text',
                nonEditable: !(
                  isEditable(person?.['Fiscal_weeks']) &&
                  key?.['currentIndex'] >= 53
                ),
                rowMappingColId: key?.['text'],
                style:
                  key &&
                  person?.['Fiscal_weeks'] &&
                  getStyle(person?.['Fiscal_weeks'], key),
                className: 'maddy',
                text: textValue || '',
                renderer: (textValue) =>
                  renderCell(textValue, key, person?.['Fiscal_weeks']),
              },
        ];
      });
      return acc;
    } catch (e) {
      console.log('error::::::::::::::::::::::', e);
    }
  }

  function tagAnamolous(
    reactGrid,
    rows,
    setRowsToRender,
    cellChangesArray,
    dispatch,
    cellIndexChanges,
    focusedRangeTwo,
    columns,
    rowsToRender,
    tag,
    headerRow
  ) {
    if (tag === 'TAG') {
      if (focusedRangeTwo?.current) {
        tagMultiple(
          reactGrid,
          rows,
          dispatch,
          focusedRangeTwo,
          tag,
          headerRow,
          setRows
        );
      } else {
        /*handle single tagging*/
        let colId = reactGrid?.state.focusedLocation.column.idx;
        let rowId = reactGrid?.state.focusedLocation.row.rowId;
        let newRows = [...rows];
        let prevRows = cloneDeep([...rows]);
        let prevCell = prevRows[rowId].cells[colId];
        let prevText = prevRows[rowId].cells[colId].text;
        /* previousCell */
        let extractPrevText = JSON.parse(prevText).textValue;
        newRows[rowId].cells[colId].text = JSON.stringify({
          textValue: extractPrevText,
          anamolousTagValue: 'FULL',
        });
        let newCell = newRows[rowId].cells[colId];
        let changes = [];
        let tempObj = {};
        tempObj = {
          previousCell: {
            ...prevCell,
          },
          newCell: {
            ...newCell,
          },
          type: 'text',
          rowId: rowId,
          columnId: reactGrid?.state.focusedLocation.column.columnId,
        };
        changes.push(tempObj);
        const duplicateChange = changes;
        dispatch(updateCellChanges(duplicateChange));
        dispatch(changeCellIndex(1));
        setRows(newRows);
        setRowsToRender([headerRow, ...getExpandedRows(newRows)]);
      }
    } else {
      if (focusedRangeTwo?.current) {
        tagMultiple(
          reactGrid,
          rows,
          dispatch,
          focusedRangeTwo,
          tag,
          headerRow,
          setRows
        );
      } else {
        /*handle single un tagging*/
        let colId = reactGrid?.state.focusedLocation.column.idx;
        let rowId = reactGrid?.state.focusedLocation.row.rowId;
        let newRows = [...rows];
        let prevRows = cloneDeep([...rows]);
        let prevCell = prevRows[rowId].cells[colId];
        let prevText = prevRows[rowId].cells[colId].text;
        /* previousCell */
        let extractPrevText = JSON.parse(prevText).textValue;
        newRows[rowId].cells[colId].text = JSON.stringify({
          textValue: extractPrevText,
          anamolousTagValue: 'null',
        });
        let newCell = newRows[rowId].cells[colId];
        let changes = [];
        let tempObj = {};
        tempObj = {
          previousCell: {
            ...prevCell,
          },
          newCell: {
            ...newCell,
          },
          type: 'text',
          rowId: rowId,
          columnId: reactGrid?.state.focusedLocation.column.columnId,
        };
        changes.push(tempObj);
        const duplicateChange = changes;
        dispatch(updateCellChanges(duplicateChange));
        dispatch(changeCellIndex(1));
        setRows(newRows);
        setRowsToRender([headerRow, ...getExpandedRows(newRows)]);
      }
    }
  }

  function tagMultiple(
    reactGrid,
    rows,
    dispatch,
    focusedRangeTwo,
    tag,
    headerRow,
    setRows
  ) {
    if (tag === 'TAG') {
      alert('hangle multiple tagging');
      let currentRows = cloneDeep([...rows]);
      let selectedRows = focusedRangeTwo?.current.rows;
      let selectedColumns = focusedRangeTwo?.current.columns;
      let changes = [];
      let tempObj = {};
      let prevCellArray = cloneDeep([...currentRows]);
      let newCellArray = cloneDeep([...currentRows]);
      selectedRows.map((row) => {
        let dataIndex = currentRows.findIndex(
          (item) => item.rowId === row.rowId
        );
        if (dataIndex) {
          selectedColumns.map((ele) => {
            let columnId = ele.columnId;
            let indexToBeChecked = ele.idx;
            let rowId = currentRows[dataIndex].rowId;
            let cellToBeEdited = currentRows[dataIndex].cells[indexToBeChecked];
            let parsedText = JSON.parse(cellToBeEdited.text);
            /* Get eligible Cells */
            if (cellToBeEdited && parsedText?.anamolousTagValue) {
              let prevCell = prevCellArray[dataIndex].cells[indexToBeChecked];
              let newCell = newCellArray[dataIndex].cells[indexToBeChecked];
              let updatedText = JSON.parse(newCell.text);
              updatedText = JSON.stringify({
                ...updatedText,
                anamolousTagValue: 'FULL',
              });
              currentRows[dataIndex].cells[indexToBeChecked].text = updatedText; //update actual row
              newCell.text = updatedText;
              tempObj = {
                previousCell: {
                  ...prevCell,
                },
                newCell: {
                  ...newCell,
                },
                type: 'text',
                rowId: rowId,
                columnId: columnId,
              };
              changes.push(tempObj);
            }
          });
        }
      });
      setRows(currentRows);
      setRowsToRender([headerRow, ...getExpandedRows(currentRows)]);
      setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
    } else {
      alert('hangle multiple un tagging');
      let currentRows = cloneDeep([...rows]);
      let selectedRows = focusedRangeTwo?.current.rows;
      let selectedColumns = focusedRangeTwo?.current.columns;
      let changes = [];
      let tempObj = {};
      let prevCellArray = cloneDeep([...currentRows]);
      let newCellArray = cloneDeep([...currentRows]);
      selectedRows.map((row) => {
        let dataIndex = currentRows.findIndex(
          (item) => item.rowId === row.rowId
        );
        if (dataIndex) {
          selectedColumns.map((ele) => {
            let columnId = ele.columnId;
            let indexToBeChecked = ele.idx;
            let rowId = currentRows[dataIndex].rowId;
            let cellToBeEdited = currentRows[dataIndex].cells[indexToBeChecked];
            let parsedText = JSON.parse(cellToBeEdited.text);
            /* Get eligible Cells */
            if (cellToBeEdited && parsedText?.anamolousTagValue) {
              let prevCell = prevCellArray[dataIndex].cells[indexToBeChecked];
              let newCell = newCellArray[dataIndex].cells[indexToBeChecked];
              let updatedText = JSON.parse(newCell.text);
              updatedText = JSON.stringify({
                ...updatedText,
                anamolousTagValue: 'null',
              });
              currentRows[dataIndex].cells[indexToBeChecked].text = updatedText; //update actual row
              newCell.text = updatedText;
              tempObj = {
                previousCell: {
                  ...prevCell,
                },
                newCell: {
                  ...newCell,
                },
                type: 'text',
                rowId: rowId,
                columnId: columnId,
              };
              changes.push(tempObj);
            }
          });
        }
      });
      setRows(currentRows);
      setRowsToRender([headerRow, ...getExpandedRows(currentRows)]);
      setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
    }
  }

  return (
    <div
      style={{
        display: 'block',
        width: 'auto',
        overflow: 'auto',
      }}
      onContextMenu={(e) => handleMasterContextMenu(e)}
    >
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
      <div
        onMouseUp={(e) => {
          e.stopPropagation();
          if (reactGrid) {
            focusedRangeTwo.current = {
              rows: reactGrid?.state?.selectedRanges?.[0]?.rows,
              columns: reactGrid?.state?.selectedRanges?.[0]?.columns,
            };
          }
        }}
      >
        <ReactGrid
          ref={(newRef) => {
            if (newRef) {
              reactGrid = newRef;
            }
          }}
          rows={rowsToRender}
          columns={columns}
          onCellsChanged={handleChanges}
          onContextMenu={handleContextMenu}
          stickyLeftColumns={1}
          stickyTopRows={1}
          enableRangeSelection
          enableRowSelection
          enableFillHandle
          initialFocusLocation={getInitialFocusLocation()}
        />
      </div>
      <div style={{ display: 'block', position: 'absolute', bottom: 0 }}>
        <button className="btn btn-primary" onClick={handleUndoChanges}>
          {' '}
          UNDO{' '}
        </button>
        <button className="btn btn-warning m-2" onClick={handleRedoChanges}>
          {' '}
          REDO{' '}
        </button>
      </div>
    </div>
  );
};

export default ForecastTable;
