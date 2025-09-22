// src/api/cartApi.js
import API from "./axiosConfig.js"; // import your Axios instance

// ====== CART ENDPOINTS ======

// Get current user's cart
export const fetchCart = async () => {
  const res = await API.get("/cart");
  console.log("Fetched cart data:", res.data); // Debug log
  return res.data;
};

// Add product to cart
export const addToCart = async (productId, quantity, sizeId) => {
  const res = await API.post(
    "/cart",
    { productId, quantity, sizeId },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return res.data;
};

// Remove cart item
export const removeFromCart = async (cartItemId) => {
  const res = await API.delete(`/cart/${cartItemId}`);
  return res.data;
};

// ====== ADMIN / DETAILED CART ITEM ENDPOINTS ======
export const fetchAllCartItems = async () => {
  const res = await API.get("/cartItems");
  return res.data;
};

export const fetchCartItemById = async (id) => {
  const res = await API.get(`/cartItems/${id}`);
  return res.data;
};

export const createCartItem = async (data) => {
  const res = await API.post("/cartItems", data);
  return res.data;
};

export const updateCartItem = async (id, data) => {
  const res = await API.put(`/cartItems/${id}`, data);
  return res.data;
};

export const deleteCartItem = async (id) => {
  const res = await API.delete(`/cartItems/${id}`);
  return res.data;
};
