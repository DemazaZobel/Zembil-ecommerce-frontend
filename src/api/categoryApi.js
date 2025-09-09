// src/api/categoryApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/categories"; // adjust if needed

// Get all categories
export const fetchCategoriesApi = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get category by ID
export const fetchCategoryByIdApi = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create new category
export const createCategoryApi = async (categoryData) => {
  const response = await axios.post(API_URL, categoryData);
  return response.data;
};

// Update
export const updateCategoryApi = async ({ id, data }) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data.category;
};

// Delete category
export const deleteCategoryApi = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

