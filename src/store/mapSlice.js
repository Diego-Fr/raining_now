import { createSlice } from "@reduxjs/toolkit";
import { fetchMeasurements } from "../services/api";

const initialState = {
  stations:[],
  map: null
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers:{
    setMap(state, action){
      // console.log(action);
      
      state.map = action.payload
    }
  }
})




export const {setMarkers, setMap,setStations, setMarker} = mapSlice.actions
// export const updateMarkers
export default mapSlice.reducer