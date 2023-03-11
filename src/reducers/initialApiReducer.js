import { weekData, masterData } from '../mock/mockData';
import { UPDATE_API_DATA } from '../constants';

let initialState = { weekData, masterData };

export const initialApiReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_API_DATA:
      return { ...action.payload };
    default:
      return state;
  }
};
