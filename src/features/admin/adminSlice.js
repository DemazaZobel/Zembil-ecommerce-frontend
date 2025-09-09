import { createSlice } from "@reduxjs/toolkit";

const initialState = { myOrders: [], loading: false, error: null };

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    setMyOrders: (state, action) => { state.myOrders = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setMyOrders, setLoading, setError } = deliverySlice.actions;
export default deliverySlice.reducer;