import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    text:'', //texto procurado
    cod: '', //cod da area
    name:'', //nome da aream
    bbox: '',
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers:{
        setSearchProps(state, {payload: {text, cod, name, bbox}}){
            state.text = text
            state.cod = cod
            state.name = name
            state.bbox = bbox
        }
    }
})

export default searchSlice.reducer

export const {setSearchProps} = searchSlice.actions