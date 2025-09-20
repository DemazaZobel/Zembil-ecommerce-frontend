// src/features/store.js
import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./admin/adminSlice";
import deliveryReducer from "./delivery/deliverySlice";
import authReducer from "./auth/authSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    delivery: deliveryReducer,
    auth: authReducer,
  },
});

export default store; // ✅ default export
