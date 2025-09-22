import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");
  const token = stored ? JSON.parse(stored).token : null;
  console.log("Attaching token to request:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
