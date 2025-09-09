import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { loginUser, logout } from "../store/userSlice"; // your slice
import { registerUser as registerAPI } from "../api/userAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Optional: Create a register thunk for Redux
export const registerUserThunk = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerAPI(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const useAuth = () => {
  const dispatch = useDispatch();
  const { info: user, token, loading, error } = useSelector((state) => state.user);

  // Login
  const login = useCallback(
    (credentials) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  // Register
  const register = useCallback(
    (userData) => {
      return dispatch(registerUserThunk(userData));
    },
    [dispatch]
  );

  // Logout
  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return { user, token, loading, error, login, register, logoutUser };
};
