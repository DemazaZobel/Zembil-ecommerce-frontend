// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCart as fetchCartApi,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  updateCartItem,
} from "../../api/cartApi.js";

// ====== Async Thunks ======

// Fetch cart from backend
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
  try {
    const cart = await fetchCartApi();
    return cart; // payload for fulfilled
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Add item to cart
// src/features/cart/cartSlice.js
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, sizeId }, thunkAPI) => {
    try {
      const cartItem = await addToCartApi(productId, quantity, sizeId);
      return cartItem; // backend response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (cartItemId, thunkAPI) => {
  try {
    await removeFromCartApi(cartItemId);
    return cartItemId; // return ID so we can remove it from state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Increase quantity
export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async ({ id, quantity }) => {
    const updatedItem = await updateCartItem(id, { quantity });
    return updatedItem;
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async ({ id, quantity }) => {
    const updatedItem = await updateCartItem(id, { quantity });
    return updatedItem;
  }
);


// ====== Slice ======
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0, // new
    status: "idle",
    error: null,
  },
  reducers: {
    clearCart: (state) => {
    state.items = [];
    state.totalQuantity = 0;
  },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload?.items || [];
      state.totalQuantity = state.items.reduce((acc, i) => acc + i.quantity, 0);
    });

    // Add to cart
    builder.addCase(addToCart.fulfilled, (state, action) => {
      const existing = state.items.find((i) => i.cartItemId === action.payload.cartItemId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalQuantity = state.items.reduce((acc, i) => acc + i.quantity, 0);
    });

    // Remove from cart
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.cartItemId !== action.payload);
      state.totalQuantity = state.items.reduce((acc, i) => acc + i.quantity, 0);
    });

    // Increase quantity
    builder.addCase(increaseQuantity.fulfilled, (state, action) => {
      const index = state.items.findIndex((i) => i.cartItemId === action.payload.cartItemId);
      if (index !== -1) state.items[index] = action.payload;
      state.totalQuantity = state.items.reduce((acc, i) => acc + i.quantity, 0);
    });

    // Decrease quantity
    builder.addCase(decreaseQuantity.fulfilled, (state, action) => {
      const index = state.items.findIndex((i) => i.cartItemId === action.payload.cartItemId);
      if (index !== -1) state.items[index] = action.payload;
      state.totalQuantity = state.items.reduce((acc, i) => acc + i.quantity, 0);
    });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
