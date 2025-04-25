import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    context: 'rain',
    hours: 24
}

const contextSlice = createSlice({
    name: 'context',
    initialState,
    reducers:{
        setContext(state, action){
            state.context = action.payload
        },
        setHours(state, action){
            state.hours = action.payload
        }
    }
})

export const {setContext, setHours} =  contextSlice.actions

export default contextSlice.reducer