// src/features/user/userApi.js
import axios from "axios";

import API from "./axiosConfig"; // adjust if needed

const API_URL = "/users"; // adjust if needed

export const getUserById = async (userId) => {
  const res = await API.get(`${API_URL}/${userId}`);
  return res.data; // { id, name, email, ... }
};
