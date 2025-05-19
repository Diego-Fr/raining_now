import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show:false
}

const RadarSlice = createSlice({
    name: 'radar',
    initialState,
    reducers:{
        setRadar(state, action){
            state.radar_id = action.payload
        },
        setShow(state, action){
            state.show = action.payload
        }
    }
})

export default RadarSlice.reducer

export const {setRadar, setShow} = RadarSlice.actions