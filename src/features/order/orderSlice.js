// src/features/order/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrderApi, fetchOrdersApi, fetchOrderByIdApi } from "../../api/orderApi";
import { fetchProductById } from "../product/productSlice";
import { getShippingAddress } from "../shipping/shipmentSlice";
import { fetchStaff } from "../delivery/deliverySlice";

// ----- Async Thunks -----

// Place an order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ cartItems, shippingAddressId, paymentMethod, zoneId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const user = state.user.info;
      if (!user) throw new Error("User not logged in");

      // 1️⃣ Shipping address
      const shipping = state.shipping.addresses.find(addr => addr.id === shippingAddressId) || null;
      if (!shipping) throw new Error("Shipping address not found");

      // 2️⃣ Match delivery staff for the selected zone
      const deliveryStaffList = state.delivery.staff;
      const assignedStaff = deliveryStaffList.find(
        staff => staff.zoneId === zoneId // use the selected zone
      );
      const assignedTo = assignedStaff ? assignedStaff.id : null;

      // 3️⃣ Build order items
      const orderItems = await Promise.all(
        cartItems.map(async item => {
          const product = state.products.products.find(p => p.id === item.productId);
          if (!product) throw new Error(`Product not found: ${item.productId}`);
          return {
            productId: item.productId,
            sizeId: item.sizeId,
            quantity: item.quantity,
            price: product.price
          };
        })
      );

      const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      // 4️⃣ Build payload
      const orderPayload = {
        userId: user.id,
        shippingAddressId,
        zoneId,           // ✅ use the zoneId from frontend
        totalPrice,
        paymentStatus: "Pending",
        paymentMethod,
        orderStatus: "Processing",
        orderItems
      };

      const response = await createOrderApi(orderPayload);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch all orders for current user
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const user = getState().user.info;
      if (!user) throw new Error("User not logged in");
      const orders = await fetchOrdersApi(user.id);
      return orders;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch single order by ID
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const order = await fetchOrderByIdApi(orderId);
      return order;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ----- Slice -----
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearOrderState: (state) => {
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Place Order ---
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.push(action.payload);
        state.successMessage = `Order #${action.payload.id} placed successfully!`;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to place order";
      })

      // --- Fetch All Orders ---
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders";
      })

      // --- Fetch Single Order ---
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch order";
      });
  }
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
