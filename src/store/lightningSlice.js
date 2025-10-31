import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show:false
}

const LightningSlice = createSlice({
    name: 'lightning',
    initialState,
    reducers:{
        setShow(state, action){
            state.show = action.payload
        }
    }
})

export default LightningSlice.reducer

export const {setShow} = LightningSlice.actions