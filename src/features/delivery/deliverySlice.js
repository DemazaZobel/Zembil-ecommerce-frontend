// src/features/delivery/deliverySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchStaffApi,
  addStaffApi,
  updateStaffApi,
  deleteStaffApi,
  fetchZonesApi,
  addZoneApi,
  updateZoneApi,
  deleteZoneApi,
} from "../../api/deliveryApi.js";

// ----- Staff Thunks -----
export const fetchStaff = createAsyncThunk("delivery/fetchStaff", fetchStaffApi);
export const addStaff = createAsyncThunk("delivery/addStaff", addStaffApi);
export const updateStaff = createAsyncThunk(
  "delivery/updateStaff",
  async ({ id, payload }) => updateStaffApi(id, payload)
);
export const deleteStaff = createAsyncThunk("delivery/deleteStaff", deleteStaffApi);

// ----- Zone Thunks -----
export const fetchZones = createAsyncThunk("delivery/fetchZones", fetchZonesApi);
export const addZone = createAsyncThunk("delivery/addZone", addZoneApi);
export const updateZone = createAsyncThunk(
  "delivery/updateZone",
  async ({ id, payload }) => updateZoneApi(id, payload)
);
export const deleteZone = createAsyncThunk("delivery/deleteZone", deleteZoneApi);

// ----- Slice -----
const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    staff: [],
    zones: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // --- Staff ---
    builder
      .addCase(fetchStaff.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStaff.fulfilled, (state, action) => { state.staff = action.payload; state.loading = false; })
      .addCase(fetchStaff.rejected, (state, action) => { state.error = action.error.message; state.loading = false; })

      .addCase(addStaff.fulfilled, (state, action) => { state.staff.push(action.payload); })
      .addCase(updateStaff.fulfilled, (state, action) => {
        const idx = state.staff.findIndex(s => s.id === action.payload.id);
        if(idx !== -1) state.staff[idx] = action.payload;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.staff = state.staff.filter(s => s.id !== action.payload.id);
      });

    // --- Zones ---
    builder
      .addCase(fetchZones.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchZones.fulfilled, (state, action) => { state.zones = action.payload; state.loading = false; })
      .addCase(fetchZones.rejected, (state, action) => { state.error = action.error.message; state.loading = false; })

      .addCase(addZone.fulfilled, (state, action) => { state.zones.push(action.payload); })
      .addCase(updateZone.fulfilled, (state, action) => {
        const idx = state.zones.findIndex(z => z.id === action.payload.id);
        if(idx !== -1) state.zones[idx] = action.payload;
      })
      .addCase(deleteZone.fulfilled, (state, action) => {
        state.zones = state.zones.filter(z => z.id !== action.payload.id);
      });
  },
});

export default deliverySlice.reducer;
