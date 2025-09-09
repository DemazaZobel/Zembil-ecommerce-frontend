import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser as loginUserAPI, registerUser as registerUserAPI } from "../../api/authApi";

// Load initial state from localStorage
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  info: userFromStorage?.user || null, // store full user object including role
  token: userFromStorage?.token || null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUserAPI(credentials);
      // Return user object and token
      return { user: response.user, token: response.token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUserAPI(userData);
      // Return user object and token (role included)
      return { user: response.user, token: response.token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.info = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload.user; // includes role
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Registration
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload.user; // includes role
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
