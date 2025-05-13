import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showZero:false
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers:{
        setFilterOption(state, action){            
            const {field, value}= action.payload;
            state[field] = value
        }
    }
})

export const {setFilterOption} = filterSlice.actions

export default filterSlice.reducer