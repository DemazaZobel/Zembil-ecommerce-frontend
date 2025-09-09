import API from "./axiosConfig";

// Auth
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = async (data) => (await API.post("/auth/register", data)).data;
export const loginUser = async (data) => (await API.post("/auth/login", data)).data;

// Products
export const getProducts = async () => (await API.get("/products", { headers: getAuthHeaders() })).data;
export const addProduct = async (data) => (await API.post("/products", data, { headers: getAuthHeaders() })).data;
export const updateProduct = async ({ id, ...data }) => (await API.put(`/products/${id}`, data, { headers: getAuthHeaders() })).data;
export const deleteProduct = async (id) => (await API.delete(`/products/${id}`, { headers: getAuthHeaders() })).data;

// Categories
export const getCategories = async () => (await API.get("/categories", { headers: getAuthHeaders() })).data;
export const addCategory = async (data) => (await API.post("/categories", data, { headers: getAuthHeaders() })).data;
export const deleteCategory = async (id) => (await API.delete(`/categories/${id}`, { headers: getAuthHeaders() })).data;

// Sizes
export const getSizes = async () => (await API.get("/sizes", { headers: getAuthHeaders() })).data;
export const addSize = async (data) => (await API.post("/sizes", data, { headers: getAuthHeaders() })).data;
export const deleteSize = async (id) => (await API.delete(`/sizes/${id}`, { headers: getAuthHeaders() })).data;

// Delivery Zones
export const getZones = async () => (await API.get("/deliveryzones", { headers: getAuthHeaders() })).data;
export const addZone = async (data) => (await API.post("/deliveryzones", data, { headers: getAuthHeaders() })).data;
export const deleteZone = async (id) => (await API.delete(`/deliveryzones/${id}`, { headers: getAuthHeaders() })).data;

// Users
export const getUsers = async () => (await API.get("/users", { headers: getAuthHeaders() })).data;
export const blockUser = async (id) => (await API.put(`/users/block/${id}`, {}, { headers: getAuthHeaders() })).data;
export const unblockUser = async (id) => (await API.put(`/users/unblock/${id}`, {}, { headers: getAuthHeaders() })).data;

// Orders
export const getOrders = async () => (await API.get("/orders", { headers: getAuthHeaders() })).data;
export const updateOrderStatus = async ({ id, status }) => (await API.put(`/orders/${id}/status`, { status }, { headers: getAuthHeaders() })).data;
export const assignDeliveryStaff = async ({ id, staffId }) => (await API.put(`/orders/${id}/assign`, { staffId }, { headers: getAuthHeaders() })).data;

// Delivery staff API
// export const getMyOrders = async () => (await API.get("/delivery/myOrders", { headers: getAuthHeaders() })).data;
export const getStaff = async () => (await API.get("/deliverystaff", { headers: getAuthHeaders() })).data;
export const addStaff = async (data) => (await API.post("/deliverystaff", data, { headers: getAuthHeaders() })).data;
export const deleteStaff = async (id) => (await API.delete(`/deliverystaff/${id}`, { headers: getAuthHeaders() })).data;