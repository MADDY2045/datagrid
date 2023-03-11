import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { weekData, masterData } from '../mock/mockData';
import { generateTableData } from '../utils/dataParsing';

const ForecastTable = () => {
  const { weekData, masterData } = useSelector(
    (state) => state.initialApiReducer
  );
  const [hiddenColumns, setHiddenColumns] = useState([]);

  useEffect(() => {
    console.log('weekData:', weekData);
    console.log('masterData:', masterData);
    const { rows, columns } = generateTableData(
      weekData,
      masterData,
      hiddenColumns
    );
    console.log('rows,columns', rows, columns);
  }, [weekData, masterData, hiddenColumns]);

  return <div>ForecastTable</div>;
};

export default ForecastTable;
