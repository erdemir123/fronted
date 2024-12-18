// src/features/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.0.2.2:8000",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken; // Store'dan token al
  
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Header'a token ekle
      }
      // console.log(headers,"headers")
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "multipart/form-data", // FormData gönderirken bu başlık gereklidir
        },
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),
    logOut: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "GET", // Çıkış işlemi için GET veya POST yöntemi olabilir
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogOutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
} = apiSlice;



