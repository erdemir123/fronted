import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "./authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Temel sorgu ayarları
const baseQuery = fetchBaseQuery({
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
});

// Token yenileme işlemi için temel sorgu
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
 

    try {
      // Refresh token isteğini gönder
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          credentials: "include", // Cookie'nin otomatik olarak gönderilmesini sağlar
        },
        api,
        extraOptions
      );


      if (refreshResult?.data) {
        const userData = refreshResult.data.user;
        accessToken = refreshResult.data.bearer.access;

        api.dispatch(
          setCredentials({ bearer: refreshResult.data.bearer, user: userData })
        );

        // Yeniden orijinal isteği yap
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
        return { error: { status: 401, message: "Unauthorized" } };
      }
    } catch (error) {
      console.error("Error during refresh token request:", error);
      api.dispatch(logOut());
      return { error: { status: 401, message: "Unauthorized" } };
    }
  }

  // console.log("Final Result:", result);
  return result;
};

// Ana API dilimini oluştur
export const mainSlice = createApi({
  reducerPath: "mainSlice", // Dilim yolu
  baseQuery: baseQueryWithReauth, // Token yenileme ile temel sorguyu kullan
  endpoints: (builder) => ({
    // Buraya API uç noktaları ekleyebilirsin
    getUsers: builder.query({
      query: () => "/users", // Kullanıcıları almak için bir uç nokta
    }),
    addFcmToken: builder.mutation({
      query: (credentials) => ({
        url: '/fcm_tokens',
        method: 'Post', // Çıkış işlemi için GET veya POST yöntemi olabilir
        body: credentials,
      }),
    }),
   
  }),
});

// API uç noktalarını dışa aktar
export const { useGetUsersQuery,useAddFcmTokenMutation } = mainSlice; // Örnek olarak getUsers query hook'unu dışa aktardık
