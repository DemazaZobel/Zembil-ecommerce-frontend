// src/features/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admins: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmins(state, action) {
      state.admins = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setAdmins, setLoading, setError } = adminSlice.actions;
export default adminSlice.reducer;
