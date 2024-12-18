import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOutUser } from "./authSlice";

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
console.log("asr")
// Token yenileme işlemi için temel sorgu
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
console.log(result,"result")
  if (result?.error?.status === 403) {
 

    try {
      // Refresh token isteğini gönder
      console.log("first,burası çalışıyor")
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
        console.log(userData,"userData")
        accessToken = refreshResult.data.bearer.access;
        console.log(accessToken,"accessToken")

        api.dispatch(
          setCredentials({ bearer: refreshResult.data.bearer, user: userData })
        );

        // Yeniden orijinal isteği yap
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("burası çalışıyor")
        api.dispatch(logOutUser());
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
    getHabits: builder.query({
      query: () => "/habits", // Kullanıcıları almak için bir uç nokta
    }),
    addFcmToken: builder.mutation({
      query: (credentials) => ({
        url: '/fcm_tokens',
        method: 'POST', // Çıkış işlemi için GET veya POST yöntemi olabilir
        body: credentials,
      }),
    }),
   
  }),
});

// API uç noktalarını dışa aktar
export const { useGetUsersQuery,useAddFcmTokenMutation,useGetHabitsQuery } = mainSlice; // Örnek olarak getUsers query hook'unu dışa aktardık
