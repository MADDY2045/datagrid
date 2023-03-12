import { combineReducers } from 'redux';
import { initialApiReducer } from './initialApiReducer';
import { redoReducer,incrementReducer } from './redoReducer';

export default combineReducers({
  initialApiReducer,
  redoReducer,
  incrementReducer
});
