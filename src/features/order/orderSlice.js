// src/features/order/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrderApi,
  fetchOrdersApi,
  fetchOrderByIdApi,
  updateOrderApi,
} from "../../api/orderApi";

// ----- Cancel Order -----
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await updateOrderApi(orderId, { orderStatus: "Cancelled" });
      return response.order; // backend should return updated order
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ----- Update Order -----
export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      // Prevent updating if order is cancelled
      if (payload.orderStatus === "Cancelled") {
        throw new Error("Cannot update a cancelled order");
      }

      const response = await updateOrderApi(id, payload);
      return response.order || response; // backend should return updated order
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ----- Place Order -----
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ cartItems, shippingAddressId, paymentMethod, zoneId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.user.info;
      if (!user) throw new Error("User not logged in");

      // Shipping address
      const shipping = state.shipping.addresses.find(addr => addr.id === shippingAddressId) || null;
      if (!shipping) throw new Error("Shipping address not found");

      // Delivery staff
      const deliveryStaffList = state.delivery.staff;
      const assignedStaff = deliveryStaffList.find(staff => staff.zoneId === zoneId);
      const assignedTo = assignedStaff ? assignedStaff.id : null;

      // Order items
      const orderItems = cartItems.map(item => {
        const product = state.products.products.find(p => p.id === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        return {
          productId: item.productId,
          sizeId: item.sizeId,
          quantity: item.quantity,
          price: product.price,
        };
      });

      const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      // Payload
      const orderPayload = {
        userId: user.id,
        shippingAddressId,
        zoneId,
        totalPrice,
        paymentStatus: "Pending",
        paymentMethod,
        orderStatus: "Processing",
        orderItems,
        assignedTo,
      };

      const response = await createOrderApi(orderPayload);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ----- Fetch Orders (Admin Only) -----
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const orders = await fetchOrdersApi();
      console.log("Fetched orders All:", orders);
      return orders;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ----- Fetch Orders for Logged-in User -----
export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.user.info;
      if (!user) throw new Error("User not logged in");

      const allOrders = await fetchOrdersApi();
      console.log("Fetched user orders:", allOrders);
      return allOrders.filter(order => order.userId === user.id);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ----- Fetch Order by ID -----
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const order = await fetchOrderByIdApi(orderId);
      console.log("Fetched order by ID:", order);
      return order;
      
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearOrderState: (state) => {
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Place Order ---
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
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

      // --- Fetch Orders (Admin) ---
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

      // --- Fetch User Orders ---
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user orders";
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
      })

      // --- Cancel Order ---
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = `Order #${action.payload.id} has been cancelled.`;
        state.orders = state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to cancel order";
      })

      // --- Update Order ---
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        );
        state.successMessage = `Order #${action.payload.id} updated successfully.`;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update order";
      });
  },
});

export const { clearOrderState } = orderSlice.actions;

export default orderSlice.reducer;
