import { createSlice, configureStore } from '@reduxjs/toolkit'
import mapSlice from './mapSlice'
import filterSlice from './filterSlice'
import stationSlice from './stationSlice'
import contextSlice from './contextSlice'

export const store = configureStore({
    reducer: {
        map: mapSlice,
        filter: filterSlice,
        station: stationSlice,
        context: contextSlice
    },
    //desativando analise de serialização para poder salvar um L.map na variavel map
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
})