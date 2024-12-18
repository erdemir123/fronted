// src/features/authSlice.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access } = action.payload.bearer; // Bearer objesinden erişim ve yenileme token'larını al
      state.accessToken = access; // Erişim token'ını state'e kaydet
      state.user = action.payload.user; // Kullanıcı bilgilerini state'e kaydet
      state.token = action.payload.token; // Kullanıcı bilgilerini state'e kaydet
    },
    logOutUser: (state, action) => {
      state.user = null;
      state.token = null;
      state.accessToken = null; // Erişim token'ını state'e kaydet
      state.refreshToken = null; // Yenileme token'ını state'e kaydet
    },
    updateUser: (state, action) => {
      state.user = { ...action.payload }; // Kullanıcı bilgisini güncelle
    },
    // Diğer reducer'lar burada tanımlanabilir
  },
});

export const { setCredentials, logOutUser, updateUser } = authSlice.actions; // setCredentials'i dışa aktarın
export default authSlice.reducer; // Reducer'ı dışa aktarın
