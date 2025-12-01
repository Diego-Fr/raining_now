// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://previsaonph.unisanta.br/' }),
  endpoints: (builder) => ({
    getValues: builder.query({
      query: (text) => `values/${'21/1/1/2025-11-18%2000:00/2025-11-25%2000:00'}`,
    })
  }),
});

export const { useGetValuesQuery } = api;
