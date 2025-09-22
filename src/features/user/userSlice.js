import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser as loginUserAPI, registerUser as registerUserAPI } from "../../api/authApi";
import { getUserById } from "../../api/userApi";

// Load initial state from localStorage
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  info: userFromStorage?.user || null, // store full user object including role
  token: userFromStorage?.token || null,
  loading: false,
  error: null,
  fetchedUsers: {}, // cache for users fetched by ID
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUserAPI(credentials);
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
      return { user: response.user, token: response.token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch user by ID (for review authors)
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getUserById(userId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
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
        state.info = action.payload.user;
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
        state.info = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user by ID (for reviews)
      .addCase(fetchUserById.fulfilled, (state, action) => {
        if (!state.fetchedUsers) state.fetchedUsers = {};
        state.fetchedUsers[action.payload.id] = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
