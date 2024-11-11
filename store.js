// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/authSlice';
import {mainSlice} from './features/mainSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [mainSlice.reducerPath]: mainSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware,mainSlice.middleware),
});

export default store; // store'u dışa aktarın
