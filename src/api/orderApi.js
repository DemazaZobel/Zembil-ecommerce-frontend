// src/features/order/orderApi.js
import API from "./axiosConfig";

// -------------------- Orders --------------------

// Create a new order (checkout)
export const createOrderApi = async (orderData) => {
  console.log("➡️ Sending order payload to backend:", orderData); // 🟢 log payload
  const res = await API.post("/orders", orderData);
  console.log("⬅️ Backend responded with:", res.data); // 🟢 log response
  return res.data;
};

// Get all orders (admin only)
export const fetchOrdersApi = async () => {
  const res = await API.get("/orders");
  return res.data; // array of orders
};

// Get single order by ID
export const fetchOrderByIdApi = async (orderId) => {
  const res = await API.get(`/orders/${orderId}`);
  return res.data; // order object
};

// Update order
export const updateOrderApi = async (orderId, updateData) => {
  const res = await API.put(`/orders/${orderId}`, updateData);
  return res.data; // { message, order }
};

// Delete order
export const deleteOrderApi = async (orderId) => {
  const res = await API.delete(`/orders/${orderId}`);
  return res.data; // { message }
};

// -------------------- Order Items (Optional) --------------------

// Fetch all order items
export const fetchOrderItemsApi = async () => {
  const res = await API.get("/orderItems");
  return res.data;
};

// Fetch single order item
export const fetchOrderItemByIdApi = async (itemId) => {
  const res = await API.get(`/orderItems/${itemId}`);
  return res.data;
};

// Create order item (usually not needed if using createOrder)
export const createOrderItemApi = async (itemData) => {
  const res = await API.post("/orderItems", itemData);
  return res.data;
};

// Update order item
export const updateOrderItemApi = async (itemId, updateData) => {
  const res = await API.put(`/orderItems/${itemId}`, updateData);
  return res.data;
};

// Delete order item
export const deleteOrderItemApi = async (itemId) => {
  const res = await API.delete(`/orderItems/${itemId}`);
  return res.data;
};
