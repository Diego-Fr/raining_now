import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show:true
}

const sideMenuSlice = createSlice({
    name: 'sidemenu',
    initialState,
    reducers: {
        setShow(state, action){
            state.show = action.payload
        }
    }
})

export const {setShow} = sideMenuSlice.actions

export default sideMenuSlice.reducer