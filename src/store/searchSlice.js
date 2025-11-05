import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    text:'', //texto procurado
    cod: '', //cod da area
    name:'', //nome da aream
    bbox: '',
    type: ''
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers:{
        setSearchProps(state, {payload: {text, cod, name, bbox, type}}){
            state.text = text
            state.cod = cod
            state.name = name
            state.bbox = bbox
            state.type = type
        }
    }
})

export default searchSlice.reducer

export const {setSearchProps} = searchSlice.actions