export let eligibleAnamolousString = 'Total_demand';
export let eligibleLockArray = ['BaseAdditiveOne', 'NonBaseOne', 'PromoOne'];
export const editableObjArrays = ['BaseAdditiveOne', 'NonBaseOne', 'PromoOne'];
export const colHeaderSequence = [
  'Lift',
  'Base',
  'NonBase',
  'NonBasePromo',
  'Non-Base Others',
  'BY Demand Forecast',
  'Total Forecast',
  'BaseAdditiveOne',
  'Total Forecast Base',
  'Total Forecast Non Base',
  //"Total Forecast Others",
  'NonBaseOne',
  'PromoOne',
  //"OtherOne",
  'Total_demand 2022',
  'Sales 2022',
  'nb_promo 2022',
  'nb_non_promo 2022',
  'Lost_Sales 2022',
  'Total_demand 2023',
  'Sales 2023',
  'nb_promo 2023',
  'nb_non_promo 2023',
  'Lost_Sales 2023',
  'Total_demand 2024',
  'Sales 2024',
  'nb_promo 2024',
  'nb_non_promo 2024',
  'Lost_Sales 2024',
];
export const parentRowsOfAnotherRows = {
  Lift: ['Base', 'NonBase', 'BY Demand Forecast'],
  NonBase: ['NonBasePromo', 'Non-Base Others'],
  'Total Forecast': [
    'Total Forecast Base',
    'ProfileBase',
    'Total Forecast Non Base',
    'BaseAdditiveOne',
  ],
  'Total Forecast Non Base': [
    'Total Forecast Others',
    'Total Forecast Promo',
    'PromoOne',
    'NonBaseOne',
  ],
  'Total_demand 2022': ['Sales 2022', 'Lost_Sales 2022'],
  'Sales 2022': ['nb_promo 2022', 'nb_non_promo 2022'],
  'Total_demand 2023': ['Sales 2023', 'Lost_Sales 2023'],
  'Sales 2023': ['nb_promo 2023', 'nb_non_promo 2023'],
  'Total_demand 2024': ['Sales 2024', 'Lost_Sales 2024'],
  'Sales 2024': ['nb_promo 2024', 'nb_non_promo 2024'],
};

export function generateTableData(weekData, masterData, hiddenColumns) {
  try {
    /* generate initial set of data */
    let initialApiData = getInitialData(weekData, masterData);
    /* generate temp col def */
    let tempColDef = generateTempColDef(initialApiData);
    /* generate columns */
    let columns = generateColumns(initialApiData);
    /* header row */
    let headerRow = initialHeaderRow(columns, hiddenColumns);
    /* get rows */
    let rows = buildTree(
      getRows(headerRow, initialApiData, tempColDef, hiddenColumns, masterData)
    );
    console.log('headerRow::::', headerRow);
    return {
      rows: [headerRow, ...getExpandedRows(rows)],
      singleRows: rows,
      columns: columns,
      headerRow: headerRow,
      response: initialApiData,
      tempColDef: tempColDef,
    };
  } catch (error) {
    console.log('error in generateTableData', error);
  }
}

function getInitialData(weekData, masterData) {
  try {
    let tempObj = {};
    let tempArray = [];
    let tempColumnDef = [];
    weekData.map((item, index) => {
      if (item?.title) {
        tempColumnDef.push({
          type: 'header',
          currentIndex: index,
          text: item?.title,
        });
      }
    });
    Object.keys(masterData).map((key) => {
      masterData?.[key].map((item, index) => {
        let title = weekData?.[index]?.title;
        if (title) {
          tempObj = {
            ...tempObj,
            ['Fiscal_weeks']: key,
            [title]: item?.['total'],
          };
        }
      });
      tempArray.push(tempObj);
    });
    return tempArray;
  } catch (error) {
    console.log('error in getinitial data', error);
  }
}

function generateTempColDef(initialData) {
  try {
    let tempColumnDef = [];
    Object.keys(initialData[0]).map((item, index) => {
      tempColumnDef.push({
        type: 'header',
        text: item,
        currentIndex: index === 0 ? 'header' : index - 1,
      });
    });
    return tempColumnDef;
  } catch (error) {
    console.log('error in generateTempColDef', error);
  }
}

function generateColumns(initialApiData) {
  try {
    let tempObj = {};
    let tempArray = [];
    Object.keys(initialApiData[0]).map((key, index) => {
      if (key === 'header') {
        tempObj = {
          columnId: key,
          width: 200,
          currentIndex: 'header',
        };
        tempArray.push(tempObj);
      } else {
        tempObj = {
          columnId: key,
          width: 200,
          currentIndex: index,
        };
        tempArray.push(tempObj);
      }
    });
    return tempArray;
  } catch (error) {
    console.log('error in generate columns', error);
  }
}

function initialHeaderRow(columns, hiddenColumns) {
  try {
    let tempObj = {};
    let tempArray = [];
    columns.map((item) => {
      tempObj = {
        type: 'header',
        text: item?.columnId,
      };
      tempArray.push(tempObj);
    });
    return {
      rowId: 'header',
      height: 35,
      cells: tempArray,
    };
  } catch (error) {
    console.log('error in initialHeaderRow', error);
  }
}

export function getRows(
  headerRow,
  initialApiRow,
  tempColDef,
  hiddenColumns,
  masterData
) {
  try {
    let returnArray = [];
    colHeaderSequence.map((value, idx) => {
      if(getParticularRowData(initialApiRow, value)[0]){
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

export function getAnamolousTagging(value, currentIndex, masterData) {
  //console.log("value::::::>>>>>>", value);
  try {
    if (
      value.includes(eligibleAnamolousString) &&
      masterData?.[value]?.[currentIndex]
    ) {
      return masterData?.[value]?.[currentIndex].isAnamolousTagged;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log('error in getAnamolousTagging', error);
  }
}

export function getLockStatus(value, currentIndex, masterData) {
  try {
    if (
      eligibleLockArray.includes(value) &&
      masterData?.[value]?.[currentIndex]
    ) {
      return masterData?.[value]?.[currentIndex]?.lockStatus;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log('error in getLockStatus', error);
  }
}

export function findParentKeyForRowValue(rowValue) {
  try {
    const keys = Object.keys(parentRowsOfAnotherRows);
    let parentKey = '';
    keys.map((key) => {
      if (parentRowsOfAnotherRows[key].includes(rowValue)) {
        parentKey = key;
        return;
      }
    });
    return parentKey;
  } catch (error) {
    console.log('error in findParentKeyForRowValue', error);
  }
}

export function getBorder(key) {
  try {
    return {
      right: {
        color: key?.['currentIndex'] === 52 && 'black',
        style: 'solid',
        width: '1px',
      },
    };
  } catch (error) {
    console.log('error in getBorder', error);
  }
}
export function getStyle(tag, key) {
  try {
    return {
      background: isEditable(tag, key) ? 'rgb(240, 232, 249)' : 'white',
      border: getBorder(key),
    };
  } catch (error) {
    console.log('error in getStyle', error);
  }
}
export function isEditable(tag, key) {
  try {
    return (
      editableObjArrays.includes(tag) &&
      !(key?.['currentIndex'] >= 0 && key?.['currentIndex'] <= 52)
    );
  } catch (error) {
    console.log('error in isEditable', error);
  }
}

export function getParticularRowData(people, rowToFind) {
  try {
    let response = people.filter((val) => val?.['Fiscal_weeks'] === rowToFind);
    if(response){
      return response;
    }
  } catch (error) {
    console.log('error in getParticularRowData', error);
  }
}

export const findChevronCell = (row) => {
  return row && row?.cells.find(function (cell) {
    return cell?.type === 'chevron';
  });
};
/*

      searches for a parent of given row

    */
export const findParentRow = (rows, row) =>
  rows.find((r) => {
    const foundChevronCell = findChevronCell(row);
    return foundChevronCell ? r.rowId === foundChevronCell.parentId : false;
  });
/*

      check if the row has children

    */
export const hasChildren = (rows, row) =>
  rows.some((r) => {
    const foundChevronCell = findChevronCell(r);
    return foundChevronCell ? foundChevronCell.parentId === row.rowId : false;
  });
/*

      Checks is row expanded

    */
export const isRowFullyExpanded = (rows, row) => {
  const parentRow = findParentRow(rows, row);
  if (parentRow) {
    const foundChevronCell = findChevronCell(parentRow);
    if (foundChevronCell && !foundChevronCell.isExpanded) return false;
    return isRowFullyExpanded(rows, parentRow);
  }
  return true;
};

export const getExpandedRows = (rows) =>
  rows.filter((row) => {
    const areAllParentsExpanded = isRowFullyExpanded(rows, row);
    return areAllParentsExpanded !== undefined ? areAllParentsExpanded : true;
  });

export const getDirectChildRows = (rows, parentRow) =>
  rows.filter(
    (row) =>
      !!row?.cells?.find(
        (cell) => cell?.type === 'chevron' && cell.parentId === parentRow.rowId
      )
  );

export function assignIndentAndHasChildren(rows, parentRow, indent = 0) {
  ++indent;
  getDirectChildRows(rows, parentRow).forEach((row) => {
    const foundChevronCell = findChevronCell(row);
    const hasRowChildrens = hasChildren(rows, row);
    if (foundChevronCell) {
      foundChevronCell.indent = indent;
      foundChevronCell.hasChildren = hasRowChildrens;
    }
    if (hasRowChildrens) assignIndentAndHasChildren(rows, row, indent);
  });
}

export const buildTree = (rows) =>
  rows.map((row) => {
    const foundChevronCell = findChevronCell(row);
    if (foundChevronCell && !foundChevronCell.parentId) {
      const hasRowChildrens = hasChildren(rows, row);
      foundChevronCell.hasChildren = hasRowChildrens;
      if (hasRowChildrens) assignIndentAndHasChildren(rows, row, 1);
    }
    //console.log("row::::", row);
    return row;
  });

export function isCellFirstColumn(text) {
  return text === 'Fiscal_weeks';
}
export function getParentId(textValue) {
  return colHeaderSequence.indexOf(findParentKeyForRowValue(textValue));
}

export function renderCell(text, key, header) {
  let actualText = JSON.parse(text).textValue;
  let anamolousTagValue = JSON.parse(text).anamolousTagValue;
  let lockStatus = JSON.parse(text).lockStatus;
  //console.log("lockStatus:::::", lockStatus);
  return (
    <>
      <>{actualText}</>
    </>
  );
}
