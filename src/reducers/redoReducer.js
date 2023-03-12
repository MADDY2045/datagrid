import { UPDATE_CELL_CHANGES,UPDATE_CELL_INDEX } from "../constants";

export const redoReducer = (initialState = [],action)=>{
    switch (action.type) {
        case UPDATE_CELL_CHANGES:
            return action.payload;
        default:
            return initialState;
    }
}

export const incrementReducer = (initialState = -1,action)=>{
    switch (action.type) {
        case UPDATE_CELL_INDEX:
            return parseInt(action.payload);
        default:
            return initialState;
    }
}