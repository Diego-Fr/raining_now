import { createSlice } from "@reduxjs/toolkit";
import { fetchMeasurements } from "../services/api";

const initialState = {
    stations: []
}

const stationSlice = createSlice({
    name: 'station',
    initialState,
    reducers:{
        setStations(state, action){
            state.stations = action.payload
        },
    }
})

export const updateStations = _ => async (dispatch,getState) =>{
    const {context} = getState()
    
    try {
      const data = await fetchMeasurements(context)
      
      dispatch(setStations(data)) //atualizando lista
      dispatch(filterStations()) //filtrando a lista, e atualizando a lista
    } catch (err) {
      console.error('Erro ao buscar marcadores:', err)
    }
}

export const filterStations = _ => async (dispatch, getState) =>{
  
  const {station, filter} = getState()
  const stations = station.stations
  
  let updated_stations = stations.map(station=>{
    let shows = [];
    for(let field in filter){
      
      if(field === 'showZero'){
          //lógica a parte
          if(filter[field]){
              shows.push(true)
          } else {
            shows.push(station.value >= 1)
          }
      } else {
          shows.push(filter[field].includes(station[field])) //sempre array
      }
    }

    return {
      ...station, show: !shows.includes(false)
    }
  })

  dispatch(setStations(updated_stations))

  
}

export const {setStations} = stationSlice.actions

export default stationSlice.reducer