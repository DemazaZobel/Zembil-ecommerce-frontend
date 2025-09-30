// src/features/delivery/deliverySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchStaffApi,
  fetchStaffByIdApi,   // ✅ new
  addStaffApi,
  updateStaffApi,
  deleteStaffApi,
  fetchZonesApi,
  addZoneApi,
  updateZoneApi,
  deleteZoneApi,
  loginStaffApi,
} from "../../api/deliveryApi.js";

//
// ----- Staff Thunks -----
//
export const fetchStaff = createAsyncThunk("delivery/fetchStaff", fetchStaffApi);

export const fetchStaffById = createAsyncThunk(
  "delivery/fetchStaffById",
  async (id) => fetchStaffByIdApi(id)
);

export const addStaff = createAsyncThunk("delivery/addStaff", addStaffApi);

export const updateStaff = createAsyncThunk(
  "delivery/updateStaff",
  async ({ id, payload }) => updateStaffApi(id, payload)
);

export const deleteStaff = createAsyncThunk(
  "delivery/deleteStaff",
  async (id) => deleteStaffApi(id)
);

//
// ----- Zone Thunks -----
//
export const fetchZones = createAsyncThunk("delivery/fetchZones", fetchZonesApi);

export const addZone = createAsyncThunk("delivery/addZone", addZoneApi);

export const updateZone = createAsyncThunk(
  "delivery/updateZone",
  async ({ id, payload }) => updateZoneApi(id, payload)
);

export const deleteZone = createAsyncThunk(
  "delivery/deleteZone",
  async (id) => deleteZoneApi(id)
);

//
// ----- Delivery Staff Login -----
//
export const deliveryLogin = createAsyncThunk(
  "delivery/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginStaffApi({ email, password });

      // Persist token + staff info
      localStorage.setItem("deliveryToken", data.token);
      localStorage.setItem("deliveryUser", JSON.stringify(data.staff));

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

//
// ----- Slice -----
//
const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    staff: [],
    selectedStaff: null,   // ✅ for single staff
    zones: [],
    loading: false,
    error: null,
    token: localStorage.getItem("deliveryToken") || null,
    user: localStorage.getItem("deliveryUser")
      ? JSON.parse(localStorage.getItem("deliveryUser"))
      : null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("deliveryToken");
      localStorage.removeItem("deliveryUser");
    },
    updateLocalUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("deliveryUser", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      //
      // --- Staff ---
      //
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.staff = action.payload;
        state.loading = false;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // ✅ new case for single staff
      .addCase(fetchStaffById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.selectedStaff = action.payload;
        state.loading = false;
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(addStaff.fulfilled, (state, action) => {
        state.staff.push(action.payload);
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        const idx = state.staff.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.staff[idx] = action.payload;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.staff = state.staff.filter((s) => s.id !== action.payload.id);
      })

      //
      // --- Zones ---
      //
      .addCase(fetchZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.zones = action.payload;
        state.loading = false;
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(addZone.fulfilled, (state, action) => {
        state.zones.push(action.payload);
      })
      .addCase(updateZone.fulfilled, (state, action) => {
        const idx = state.zones.findIndex((z) => z.id === action.payload.id);
        if (idx !== -1) state.zones[idx] = action.payload;
      })
      .addCase(deleteZone.fulfilled, (state, action) => {
        state.zones = state.zones.filter((z) => z.id !== action.payload.id);
      })

      //
      // --- Login ---
      //
      .addCase(deliveryLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deliveryLogin.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.staff;
        state.loading = false;
      })
      .addCase(deliveryLogin.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { logout, updateLocalUser } = deliverySlice.actions;
export default deliverySlice.reducer;
