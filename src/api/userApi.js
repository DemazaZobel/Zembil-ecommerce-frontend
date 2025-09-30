// src/features/user/userApi.js
import axios from "axios";
import API from "./axiosConfig"; // make sure this points to your backend base URL

const API_URL = "/users"; // adjust if needed

// --- GET user by ID ---
export const getUserById = async (userId) => {
  const res = await API.get(`${API_URL}/${userId}`);
  return res.data; // { id, name, email, ... }
};

// --- GET all users ---
export const getAllUsers = async () => {
  const res = await API.get(API_URL);
  return res.data; // array of users
};

// --- UPDATE user ---
export const updateUserById = async (userId, userData) => {
  const res = await API.put(`${API_URL}/${userId}`, userData);
  return res.data; // updated user object
};

// --- DELETE user ---
export const deleteUserById = async (userId) => {
  const res = await API.delete(`${API_URL}/${userId}`);
  return res.data; // confirmation message or deleted user ID
};
