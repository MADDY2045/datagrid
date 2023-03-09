import { combineReducers } from 'redux';
import { updateRowReducer, isColumnHiddenReducer } from './updateRowReducer';

export default combineReducers({
  updateRowReducer,
  isColumnHiddenReducer,
});
