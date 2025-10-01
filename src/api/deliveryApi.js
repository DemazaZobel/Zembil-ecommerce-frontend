// src/features/delivery/deliveryApi.js
import axios from "axios";

// -------------------- Admin Axios Instance --------------------
const adminAPI = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach admin token from localStorage
adminAPI.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user"); // admin token
  const token = stored ? JSON.parse(stored).token : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------------------- Delivery Staff Axios Instance --------------------
const deliveryAPI = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach delivery staff token from localStorage
deliveryAPI.interceptors.request.use((config) => {
  const stored = localStorage.getItem("deliveryUser"); // staff token
  const token = stored ? JSON.parse(stored).token : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------------------- Admin APIs --------------------
export const fetchStaffAdminApi = async () => {
  const res = await adminAPI.get("/deliverystaff");
  return res.data;
};

export const addStaffAdminApi = async (payload) => {
  const res = await adminAPI.post("/deliverystaff", payload);
  return res.data;
};

export const updateStaffAdminApi = async (id, payload) => {
  const res = await adminAPI.put(`/deliverystaff/${id}`, payload);
  return res.data;
};

export const deleteStaffAdminApi = async (id) => {
  const res = await adminAPI.delete(`/deliverystaff/${id}`);
  return res.data;
};

// -------------------- Delivery Staff APIs --------------------
export const fetchStaffApi = async () => {
  const res = await deliveryAPI.get("/deliverystaff");
  return res.data;
};

export const fetchStaffByIdApi = async (id) => {
  const res = await deliveryAPI.get(`/deliverystaff/${id}`);
  return res.data;
};

export const loginStaffApi = async (payload) => {
  const res = await deliveryAPI.post("/deliverystaff/login", payload);
  return res.data;
};

// -------------------- Zone APIs (shared) --------------------
export const fetchZonesApi = async () => {
  const res = await deliveryAPI.get("/deliveryzones");
  return res.data;
};

export const addZoneApi = async (payload) => {
  const res = await deliveryAPI.post("/deliveryzones", payload);
  return res.data;
};

export const updateZoneApi = async (id, payload) => {
  const res = await deliveryAPI.put(`/deliveryzones/${id}`, payload);
  return res.data;
};

export const deleteZoneApi = async (id) => {
  const res = await deliveryAPI.delete(`/deliveryzones/${id}`);
  return res.data;
};
