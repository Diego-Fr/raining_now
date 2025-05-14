import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    context: 'rain',
    hours: 1,
    endDate: undefined
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
        },
        setEndDate(state, action){
            const {hours, endDate} = action.payload
            state.hours = hours
            state.endDate = endDate
        }
    }
})

export const {setContext, setHours,setEndDate} =  contextSlice.actions

export default contextSlice.reducer