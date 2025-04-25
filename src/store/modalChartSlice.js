import { createSlice } from "@reduxjs/toolkit"
import moment from "moment"

const initialState = {
    station_id: null,
    start_date: moment().utc().subtract(1, 'day').format('YYYY-MM-DD'),
    end_date: moment().utc().format('YYYY-MM-DD'),
    counter: 1 //helper
}

const modalChartSlice = createSlice({
    name: 'modalchart',
    initialState,
    reducers:{
        setStationId(state, action){
            state.station_id = action.payload
        },
        setStartDate(state, action){
            state.start_date = action.payload
        },
        setEndDate(state, action){
            state.end_date = action.payload
        },
        setOptions(state, action){
            return {...state, counter: state.counter + 1, ...action.payload}
        }
    }
})

export const {setStationId, setEndDate, setStartDate,setOptions} = modalChartSlice.actions

export default modalChartSlice.reducer