// src/features/delivery/deliveryApi.js
import axios from "axios";

// ----- Staff Axios Instance -----
const staffAPI = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

// Attach delivery staff token automatically
staffAPI.interceptors.request.use((config) => {
  const stored = localStorage.getItem("deliveryUser");
  const token = stored ? JSON.parse(stored).token : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----- Staff APIs -----
export const fetchStaffApi = async () => {
  const res = await staffAPI.get("/deliverystaff");
  console.log("fetchStaffApi response:", res.data);
  return res.data;
};

export const fetchStaffByIdApi = async (id) => {
  const res = await staffAPI.get(`/deliverystaff/${id}`);
  console.log("fetchStaffByIdApi response:", res.data);
  return res.data;
};

export const addStaffApi = async (payload) => {
  const res = await staffAPI.post("/deliverystaff", payload);
  return res.data;
};

export const updateStaffApi = async (id, payload) => {
  const res = await staffAPI.put(`/deliverystaff/${id}`, payload);
  return res.data;
};

export const deleteStaffApi = async (id) => {
  const res = await staffAPI.delete(`/deliverystaff/${id}`);
  return res.data;
};

// ----- Zone APIs -----
export const fetchZonesApi = async () => {
  const res = await staffAPI.get("/deliveryzones");
  return res.data;
};

export const addZoneApi = async (payload) => {
  const res = await staffAPI.post("/deliveryzones", payload);
  return res.data;
};

export const updateZoneApi = async (id, payload) => {
  const res = await staffAPI.put(`/deliveryzones/${id}`, payload);
  return res.data;
};

export const deleteZoneApi = async (id) => {
  const res = await staffAPI.delete(`/deliveryzones/${id}`);
  return res.data;
};

// ----- Delivery Staff Login -----
export const loginStaffApi = async (payload) => {
  const res = await staffAPI.post("/deliverystaff/login", payload);
  return res.data;
};
