// src/features/store.js
import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";
import deliveryReducer from "./deliverySlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    delivery: deliveryReducer,
    auth: authReducer,
  },
});

export default store; // ✅ default export
