import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show:false
}

const layersControlSlice = createSlice({
    name: 'layersControl',
    initialState,
    reducers:{
        setShow(state, action){
            state.show = action.payload
        }
    }
})

export default layersControlSlice.reducer

export const {setShow} = layersControlSlice.actions