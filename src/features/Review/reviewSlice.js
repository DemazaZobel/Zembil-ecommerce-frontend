import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as reviewApi from "../../api/reviewApi";

// Fetch reviews for a specific product
export const getReviewsByProduct = createAsyncThunk(
  "review/getByProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await reviewApi.fetchReviewsByProduct(productId);
      return { productId, reviews: res };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch reviews");
    }
  }
);

// Add a review
export const addReview = createAsyncThunk(
  "review/add",
  async ({ reviewData, token }, { rejectWithValue }) => {
    try {
      const res = await reviewApi.createReview(reviewData, token);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add review");
    }
  }
);

// Edit a review
export const editReview = createAsyncThunk(
  "review/edit",
  async ({ id, reviewData, token }, { rejectWithValue }) => {
    try {
      const res = await reviewApi.updateReview(id, reviewData, token);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to edit review");
    }
  }
);

// Delete a review
export const removeReview = createAsyncThunk(
  "review/remove",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await reviewApi.deleteReview(id, token);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete review");
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    allReviews: [],
    productReviews: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get reviews
      .addCase(getReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, reviews } = action.payload;
        // ✅ Ensure rating is a number
        state.productReviews[productId] = reviews.map((r) => ({
          ...r,
          rating: Number(r.rating) || 0,
        }));
      })
      .addCase(getReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add review
      .addCase(addReview.fulfilled, (state, action) => {
        const review = { ...action.payload, rating: Number(action.payload.rating) || 0 };
        const pid = review.productId;
        if (!state.productReviews[pid]) state.productReviews[pid] = [];
        state.productReviews[pid].push(review);
        state.allReviews.push(review);
      })

      // Edit review
      .addCase(editReview.fulfilled, (state, action) => {
        const updated = { ...action.payload, rating: Number(action.payload.rating) || 0 };
        const pid = updated.productId;
        if (state.productReviews[pid]) {
          state.productReviews[pid] = state.productReviews[pid].map((r) =>
            r.id === updated.id ? updated : r
          );
        }
        state.allReviews = state.allReviews.map((r) =>
          r.id === updated.id ? updated : r
        );
      })

      // Remove review
      .addCase(removeReview.fulfilled, (state, action) => {
        const id = action.payload;
        for (const pid in state.productReviews) {
          state.productReviews[pid] = state.productReviews[pid].filter(
            (r) => r.id !== id
          );
        }
        state.allReviews = state.allReviews.filter((r) => r.id !== id);
      });
  },
});

export default reviewSlice.reducer;
