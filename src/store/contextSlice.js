import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    context: 'rain'
}

const contextSlice = createSlice({
    name: 'context',
    initialState,
    reducers:{
        setContext(state, action){
            state.context = action.payload
        }
    }
})

export const {setContext} =  contextSlice.actions

export default contextSlice.reducer