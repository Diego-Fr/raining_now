// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://apps.spaguas.sp.gov.br/sibh/api/v2',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token   // <--- Pega do Redux

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    getCities: builder.query({
      query: () => 'cities?with_bbox=true',
    }),
    getSubugrhis: builder.query({
      query: () => 'subugrhis?with_bbox=true',
    }),
    getStation:builder.query({
      query: (id) => `stations/${id}`,
    }),
    setStationPublic: builder.mutation({
      query: ({id, data}) => ({
        url: `stations/${id}/public`,
        method: 'PATCH',
        body: data
      })
    }),
    setMeasurementsClassification: builder.mutation({
      query: (data) => ({
        url: `measurements/update_classification`,
        method: 'POST',
        body: data
      }) 
    })
  }),
});

export const { useGetCitiesQuery, useGetStationQuery, useGetSubugrhisQuery,useSetStationPublicMutation, useSetMeasurementsClassificationMutation } = api;
