import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filterOptions:{
        showZero:false
    },
    filterFormOptions:{
        show:false
    }
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers:{
        setFilterOption(state, action){            
            const {field, value}= action.payload;
            state.filterOptions  = {
                ...state.filterOptions,
                [field]:value
            }
        },
        setFilterFormOption(state, action){            
            const {field, value}= action.payload;
            state.filterFormOptions = {
                ...state.filterFormOptions,
                [field]:value
            }
        }
    }
})

export const {setFilterOption,setFilterFormOption} = filterSlice.actions

export default filterSlice.reducer