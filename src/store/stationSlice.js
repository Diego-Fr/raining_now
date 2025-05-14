import { createSlice } from "@reduxjs/toolkit";
import { fetchMeasurements } from "../services/api";
import { classifyStation } from "../utils/stationUtils";

const initialState = {
    stations: [],
    stationsLoading: false,
    loadingError: false
}

const stationSlice = createSlice({
    name: 'station',
    initialState,
    reducers:{
        setStations(state, action){
            state.stations = action.payload
        },
        setStationsLoading(state, action){
          state.stationsLoading = action.payload
        },
        setLoadingError(state, action){
          state.loadingError = action.payload
        }
    }
})

export const updateStations = _ => async (dispatch,getState) =>{
    const {context} = getState()
    
    dispatch(setStations([]))

    dispatch(setStationsLoading(true))
    
    try {      

      let data = await fetchMeasurements(context)
      
      data = data.map(x=>classifyStation(x,context.context)) //classificação do dado feita na obtenção do mesmo
      
      dispatch(setStations(data)) //atualizando lista
      dispatch(filterStations()) //filtrando a lista, e atualizando a lista
      dispatch(setLoadingError(false))
      dispatch(setStationsLoading(false))
    } catch (err) {
      dispatch(setStationsLoading(false))
      dispatch(setLoadingError(true))
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
        shows.push(station[field] === undefined || filter[field].length === 0 || filter[field].includes(station[field])) //sempre array
      }
    }

    return {
      ...station, show: !shows.includes(false)
    }
  })

  dispatch(setStations(updated_stations))

  
}

export const {setStations,setStationsLoading,setLoadingError} = stationSlice.actions

export default stationSlice.reducer