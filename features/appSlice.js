





import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    alert: {
        visible: false,
        message: "",
        type: "danger", // Varsayılan olarak 'danger' tipi
      },
  };
  
  const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
      setAlert: (state, action) => {
        state.alert = action.payload; // Kullanıcı bilgilerini state'e kaydet
      },
  
      // Diğer reducer'lar burada tanımlanabilir
    },
  });

export const { setAlert } = appSlice.actions

export default appSlice.reducer

export const selectAlert = (state) => state.app.alert
