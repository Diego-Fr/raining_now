import { createSlice, configureStore } from '@reduxjs/toolkit'
import mapSlice from './mapSlice'
import filterSlice from './filterSlice'
import stationSlice from './stationSlice'
import contextSlice from './contextSlice'
import modalChartSlice from './modalChartSlice'
import authSlice from './authSlice'
import radarSlice from './radarSlice'
import timelineSlice from './timelineSlice'
import sidemenu from './sideMenuSlice'

export const store = configureStore({
    reducer: {
        map: mapSlice,
        filter: filterSlice,
        station: stationSlice,
        context: contextSlice,
        modalchart: modalChartSlice,
        auth: authSlice,
        radar: radarSlice,
        timeline: timelineSlice,
        sidemenu: sidemenu
    },
    //desativando analise de serialização para poder salvar um L.map na variavel map
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})