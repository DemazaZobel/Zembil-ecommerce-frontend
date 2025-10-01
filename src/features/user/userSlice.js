import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser as loginUserAPI,
  registerUser as registerUserAPI,
} from "../../api/authApi";
import {
  getUserById,
  updateUserById,
  deleteUserById,
} from "../../api/userApi";

// Load initial state from localStorage
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  info: userFromStorage?.user || null,
  token: userFromStorage?.token || null,
  loading: false,
  error: null,
  fetchedUsers: {},
};

// --- Async Thunks ---

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

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const updatedUser = await updateUserById(userId, userData);
      // Handle backend returning { message, user } or just user
      return updatedUser.user ? updatedUser.user : updatedUser;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const result = await deleteUserById(userId);
      return { id: userId, ...result };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- Slice ---
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

      // Fetch user by ID
      .addCase(fetchUserById.fulfilled, (state, action) => {
        if (!state.fetchedUsers) state.fetchedUsers = {};
        state.fetchedUsers[action.payload.id] = action.payload;
      })

      // Update user (profile or password)
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload; // now guaranteed to be user object
        state.fetchedUsers[updated.id] = updated;

        if (state.info?.id === updated.id) {
          state.info = updated; // update logged-in user
          const token = state.token;
          localStorage.setItem("user", JSON.stringify({ user: updated, token }));
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        delete state.fetchedUsers[deletedId];
        if (state.info?.id === deletedId) {
          state.info = null;
          state.token = null;
          localStorage.removeItem("user");
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
