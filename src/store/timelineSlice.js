import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show: false,
    items: [],
    showingIndex: 0,
}

const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
        setTimelineItems(state, action){
            state.items = action.payload
        },
        setTimelineShowingIndex(state, action){
            state.showingIndex = action.payload
        }
    }
})

export const {setTimelineItems,setTimelineShowingIndex} = timelineSlice.actions

export default timelineSlice.reducer



