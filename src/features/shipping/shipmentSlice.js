// src/features/shipping/shipmentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllShippingAddresses,
  fetchShippingAddressById,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../../api/ShipmentApi";

// --- Async Thunks ---

// Get all shipping addresses
export const getShippingAddresses = createAsyncThunk(
  "shipping/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllShippingAddresses();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get a single shipping address
export const getShippingAddress = createAsyncThunk(
  "shipping/getById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchShippingAddressById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new shipping address
export const addShippingAddress = createAsyncThunk(
  "shipping/create",
  async (addressData, { rejectWithValue }) => {
    try {
      const data = await createShippingAddress(addressData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update an existing shipping address
export const editShippingAddress = createAsyncThunk(
  "shipping/update",
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const data = await updateShippingAddress(id, addressData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a shipping address
export const removeShippingAddress = createAsyncThunk(
  "shipping/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteShippingAddress(id);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- Slice ---
const shipmentSlice = createSlice({
  name: "shipping",
  initialState: {
    addresses: [],
    currentAddress: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentAddress: (state) => {
      state.currentAddress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all
      .addCase(getShippingAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShippingAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(getShippingAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAddress = action.payload;
      })
      .addCase(getShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(addShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(editShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.map((addr) =>
          addr.id === action.payload.address.id ? action.payload.address : addr
        );
      })
      .addCase(editShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(removeShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload.id
        );
      })
      .addCase(removeShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentAddress } = shipmentSlice.actions;
export default shipmentSlice.reducer;
