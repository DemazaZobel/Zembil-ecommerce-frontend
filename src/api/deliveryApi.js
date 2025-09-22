// src/features/delivery/deliveryApi.js
import axios from "./axiosConfig";

// ----- Staff -----
export const fetchStaffApi = async () => {
  const res = await axios.get("/deliverystaff");
  return res.data;
};

export const addStaffApi = async (payload) => {
  const res = await axios.post("/deliverystaff", payload);
  return res.data;
};

export const updateStaffApi = async (id, payload) => {
  const res = await axios.put(`/deliverystaff/${id}`, payload);
  return res.data;
};

export const deleteStaffApi = async (id) => {
  const res = await axios.delete(`/deliverystaff/${id}`);
  return res.data;
};

// ----- Zones -----
export const fetchZonesApi = async () => {
  const res = await axios.get("/deliveryzones");
  return res.data;
};

export const addZoneApi = async (payload) => {
  const res = await axios.post("/deliveryzones", payload);
  return res.data;
};

export const updateZoneApi = async (id, payload) => {
  const res = await axios.put(`/deliveryzones/${id}`, payload);
  return res.data;
};

export const deleteZoneApi = async (id) => {
  const res = await axios.delete(`/deliveryzones/${id}`);
  return res.data;
};
