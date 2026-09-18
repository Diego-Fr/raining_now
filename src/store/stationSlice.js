import { createSlice } from "@reduxjs/toolkit";
import { fetchMeasurements } from "../services/api";
import { classifyStation } from "../utils/stationUtils";
import { api } from "../services/sibh_api";

const initialState = {
    stations: [],
    stationsLoading: false,
    loadingError: false,
    updateTimer: false
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
        },
        setUpdateTimer(state, action){
          state.updateTimer = action.payload
        }
    }
})

//as medições de nível (now_flu) não vêm com subugrhi_cod/ugrhi_cod, só com subugrhi_id/ugrhi_id.
//como o filtro por área (busca de ugrhi/subugrhi) usa o campo _cod, sem isso os marcadores de nível nunca eram filtrados.
//aqui completamos os campos _cod usando a lista de referência de subugrhis/ugrhis (id -> cod).
const fillMissingCods = async (stations, dispatch) =>{
  const hasMissingSubugrhiCod = stations.some(s=> s.subugrhi_cod === undefined && s.subugrhi_id !== undefined)
  const hasMissingUgrhiCod = stations.some(s=> s.ugrhi_cod === undefined && s.ugrhi_id !== undefined)

  if(!hasMissingSubugrhiCod && !hasMissingUgrhiCod) return stations

  const [subugrhis, ugrhis] = await Promise.all([
    hasMissingSubugrhiCod ? dispatch(api.endpoints.getSubugrhis.initiate()).unwrap() : Promise.resolve([]),
    hasMissingUgrhiCod ? dispatch(api.endpoints.getUgrhis.initiate()).unwrap() : Promise.resolve([]),
  ])

  const subugrhiCodById = Object.fromEntries(subugrhis.map(s=>[String(s.id), s.cod]))
  const ugrhiCodById = Object.fromEntries(ugrhis.map(u=>[String(u.id), u.cod]))

  return stations.map(s=>{
    let extra = {}
    if(s.subugrhi_cod === undefined && s.subugrhi_id !== undefined) extra.subugrhi_cod = subugrhiCodById[String(s.subugrhi_id)]
    if(s.ugrhi_cod === undefined && s.ugrhi_id !== undefined) extra.ugrhi_cod = ugrhiCodById[String(s.ugrhi_id)]
    return Object.keys(extra).length ? {...s, ...extra} : s
  })
}

export const updateStations = _ => async (dispatch,getState) =>{
    const {context, station} = getState()

    dispatch(setStations([]))

    dispatch(setStationsLoading(true))

    if(station.updateTimer){
      clearTimeout(station.updateTimer)
    }

    try {

      let data = await fetchMeasurements(context)

      data = await fillMissingCods(data, dispatch)

      data = data.map(x=>classifyStation(x,context.context)) //classificação do dado feita na obtenção do mesmo
      
      dispatch(setStations(data)) //atualizando lista
      dispatch(filterStations()) //filtrando a lista, e atualizando a lista
      dispatch(setLoadingError(false))
      dispatch(setStationsLoading(false))

      let t = setTimeout(_=>{        
        dispatch(updateStations())
      }, 1000*60) //1 minuto

      dispatch(setUpdateTimer(t))

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
    for(let field in filter.filterOptions){
      // console.log(field);
      
      if(field === 'showZero'){
          //lógica a parte
          if(filter[field]){
              shows.push(true)
          } else {
            shows.push(station.value >= 1)
          }
      } else {
        shows.push(station[field] === undefined || filter.filterOptions[field].length === 0 || filter.filterOptions[field].includes(station[field])) //sempre array
      }
    }

    return {
      ...station, show: !shows.includes(false)
    }
  })

  dispatch(setStations(updated_stations))

  
}

export const {setStations,setStationsLoading,setLoadingError,setUpdateTimer} = stationSlice.actions

export default stationSlice.reducer