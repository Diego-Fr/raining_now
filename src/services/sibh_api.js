// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://apps.spaguas.sp.gov.br/sibh/api/v2' }),
  endpoints: (builder) => ({
    getCities: builder.query({
      query: () => 'cities?with_bbox=true',
    }),
    getSubugrhis: builder.query({
      query: () => 'subugrhis?with_bbox=true',
    }),
  }),
});

export const { useGetCitiesQuery, useGetSubugrhisQuery } = api;
