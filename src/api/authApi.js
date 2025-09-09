import API from "./axiosConfig";

// Register user
export const registerUser = async (userData) => {
  // POST request to /auth/register
  const response = await API.post("/auth/register", userData);
  console.log(response.data);
  return response.data;
};

// Optional: login
export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};