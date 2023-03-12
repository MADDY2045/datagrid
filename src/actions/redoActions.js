import { UPDATE_CELL_CHANGES,UPDATE_CELL_INDEX } from "../constants";

export const updateCellChanges = (data)=>(dispatch,getState)=>{
    const {redoReducer,incrementReducer} = getState();
    let updatedArray = [...redoReducer.slice(0,incrementReducer + 1),data];
    dispatch({type:UPDATE_CELL_CHANGES,payload:updatedArray});
}

export const changeCellIndex = (value)=>(dispatch,getState)=>{
    const {incrementReducer} = getState();
    let resp = incrementReducer + value;
    dispatch({type:UPDATE_CELL_INDEX,payload:resp});
}