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
console.log("Fetched products:", fetchProductsApi());
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
        // Ensure sizes are always parsed correctly
        state.products = action.payload.map((p) => ({
          ...p,
          sizes: p.sizes || [],
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = {
          ...action.payload,
          sizes: action.payload.sizes || [],
        };
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push({
          ...action.payload.product,
          sizes: action.payload.product.sizes || [],
        });
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.product.id);
        if (index !== -1) {
          state.products[index] = {
            ...action.payload.product,
            sizes: action.payload.product.sizes || [],
          };
        }
        // Also update currentProduct if it matches
        if (state.currentProduct?.id === action.payload.product.id) {
          state.currentProduct = {
            ...action.payload.product,
            sizes: action.payload.product.sizes || [],
          };
        }
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.meta.arg);
        if (state.currentProduct?.id === action.meta.arg) state.currentProduct = null;
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
