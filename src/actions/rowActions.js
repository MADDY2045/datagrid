import { IS_COLUMN_HIDDEN } from '../constants';

export const updateDummyRow = (data) => (dispatch) => {
  dispatch({ type: 'UPDATE_ROW_DUMMY', payload: data });
};

export const isColumnHidden = (data) => (dispatch) => {
  dispatch({ type: IS_COLUMN_HIDDEN, payload: data });
};
