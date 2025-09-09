// src/features/product/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductsApi,
  fetchProductByIdApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../../api/productApi";

// Async thunks
export const fetchProducts = createAsyncThunk("products/fetchAll", fetchProductsApi);
export const fetchProductById = createAsyncThunk("products/fetchById", fetchProductByIdApi);
export const createProduct = createAsyncThunk("products/create", createProductApi);
export const updateProduct = createAsyncThunk("products/update", updateProductApi);
export const deleteProduct = createAsyncThunk("products/delete", deleteProductApi);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.meta.arg);
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
