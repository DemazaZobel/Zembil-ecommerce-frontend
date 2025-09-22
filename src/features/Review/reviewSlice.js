// src/features/review/reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllReviews,
  fetchReviewsByProduct,
  createReview,
  updateReview,
  deleteReview,
} from "../../api/reviewApi";

// --- Async Thunks ---

// Fetch all reviews
export const getAllReviews = createAsyncThunk(
  "review/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllReviews();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch reviews for a specific product
export const getReviewsByProduct = createAsyncThunk(
  "review/getByProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await fetchReviewsByProduct(productId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a new review
export const addReview = createAsyncThunk(
  "review/add",
  async ({ reviewData, token }, { rejectWithValue }) => {
    try {
      const data = await createReview(reviewData, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update a review
export const editReview = createAsyncThunk(
  "review/update",
  async ({ id, reviewData, token }, { rejectWithValue }) => {
    try {
      const data = await updateReview(id, reviewData, token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete a review
export const removeReview = createAsyncThunk(
  "review/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const data = await deleteReview(id, token);
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Slice ---
const reviewSlice = createSlice({
  name: "review",
  initialState: {
    allReviews: [],
    productReviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProductReviews: (state) => {
      state.productReviews = [];
    },
  },
  extraReducers: (builder) => {
    // --- All reviews ---
    builder
      .addCase(getAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.allReviews = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Product reviews ---
    builder
      .addCase(getReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = action.payload;
      })
      .addCase(getReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Add review ---
    builder
      .addCase(addReview.fulfilled, (state, action) => {
        state.productReviews.push(action.payload.review);
        state.allReviews.push(action.payload.review);
      });

    // --- Update review ---
    builder
      .addCase(editReview.fulfilled, (state, action) => {
        const idx = state.productReviews.findIndex(
          (r) => r.id === action.payload.review.id
        );
        if (idx !== -1) state.productReviews[idx] = action.payload.review;

        const idxAll = state.allReviews.findIndex(
          (r) => r.id === action.payload.review.id
        );
        if (idxAll !== -1) state.allReviews[idxAll] = action.payload.review;
      });

    // --- Delete review ---
    builder
      .addCase(removeReview.fulfilled, (state, action) => {
        state.productReviews = state.productReviews.filter(
          (r) => r.id !== action.payload.id
        );
        state.allReviews = state.allReviews.filter(
          (r) => r.id !== action.payload.id
        );
      });
  },
});

export const { clearProductReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
