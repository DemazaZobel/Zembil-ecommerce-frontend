import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fake API
const fakeLoginAPI = async ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "test@example.com" && password === "123456") {
        resolve({ name: "Seleshi Tadesse", email, token: "abc123" });
      } else {
        reject("Invalid credentials");
      }
    }, 1000);
  });
};

// Async thunk
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fakeLoginAPI(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Load initial state from localStorage
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  info: userFromStorage,
  token: userFromStorage?.token || null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.info = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("user"); // Clear storage on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
        state.token = action.payload.token;

        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
