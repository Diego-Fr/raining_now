import { createSlice } from "@reduxjs/toolkit"
import moment from "moment"

const initialState = {
    station_id: null,
    start_date: moment().subtract(1, 'day').set({hour: 3, minute: 0}),
    end_date: moment().add(1, 'day').set({hour: 2, minute: 59}),
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
            if(!action.payload){
                state.start_date = moment().subtract(1, 'day')
            } else if(action.payload.isAfter(moment())){
                state.start_date = moment()
            } else {
                state.start_date = action.payload
            }
            state.start_date = state.start_date.set({hour: 3, minute:0})
        },
        setEndDate(state, action){
            
            if(!action.payload){
                state.end_date = moment()
            } else if(action.payload.isAfter(moment())){
                state.end_date = moment()
            } else {
                console.log('NAO');
                
                state.end_date = action.payload
            }
            state.end_date = state.end_date.add(1, 'day').set({hour: 2, minute:59})

            
            
        },
        setOptions(state, action){
            return {...state, counter: state.counter + 1, ...action.payload}
        }
    }
})

export const {setStationId, setEndDate, setStartDate,setOptions} = modalChartSlice.actions

export default modalChartSlice.reducer