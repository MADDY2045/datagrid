import { initialApiRow } from '../utils/dataParsing';
import { IS_COLUMN_HIDDEN } from '../constants';

export const updateRowReducer = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_ROW_DUMMY':
      return [...action.payload];

    default:
      return state;
  }
};

export const isColumnHiddenReducer = (state = false, action) => {
  switch (action.type) {
    case IS_COLUMN_HIDDEN:
      return action.payload;

    default:
      return state;
  }
};
