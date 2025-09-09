import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCategoriesApi,
  fetchCategoryByIdApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../api/categoryApi";

// Async thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  fetchCategoriesApi
);
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchById",
  fetchCategoryByIdApi
);
export const createCategory = createAsyncThunk(
  "categories/create",
  createCategoryApi
);
export const updateCategory = createAsyncThunk(
  "categories/update",
  updateCategoryApi
);
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  deleteCategoryApi
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch by ID
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.currentCategory = action.payload;
      })

      // Create
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // Update
        // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.categories[index] = action.payload;
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.meta.arg
        );
      });
  },
});

export const { clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
