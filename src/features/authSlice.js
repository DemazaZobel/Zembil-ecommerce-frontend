import { createSlice } from "@reduxjs/toolkit";

const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user,
    role: user ? user.role : null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
