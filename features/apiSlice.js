// src/features/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.0.2.2:8000' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      
    }),
    logOut: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'GET', // Çıkış işlemi için GET veya POST yöntemi olabilir
      }),
    }),
   
  }),
});

export const { useLoginMutation,useLogOutMutation } = apiSlice;
