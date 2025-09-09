import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // products in cart
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, size, quantity, ...rest } = action.payload;

      // Check if item with same id + size already exists
      const existing = state.items.find(
        (item) => item.id === id && item.size === size
      );

      if (existing) {
        existing.quantity += quantity || 1;
      } else {
        state.items.push({ id, size, quantity: quantity || 1, ...rest });
      }

      // Recalculate totals
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    removeFromCart: (state, action) => {
      const { id, size } = action.payload;

      // Remove only the matching id + size
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size === size)
      );

      // Recalculate totals
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    increaseQuantity: (state, action) => {
      const { id, size } = action.payload;
      const item = state.items.find(
        (i) => i.id === id && i.size === size
      );
      if (item) item.quantity += 1;

      // Recalculate totals
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    decreaseQuantity: (state, action) => {
      const { id, size } = action.payload;
      const item = state.items.find(
        (i) => i.id === id && i.size === size
      );
      if (item && item.quantity > 1) item.quantity -= 1;

      // Recalculate totals
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
