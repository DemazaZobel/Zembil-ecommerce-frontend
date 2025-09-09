// src/features/product/productApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/products"; // adjust if needed

// Get all products
export const fetchProductsApi = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get product by ID
export const fetchProductByIdApi = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create new product
export const createProductApi = async (productData) => {
  const response = await axios.post(API_URL, productData);
  return response.data;
};

// Update product
export const updateProductApi = async ({ id, productData }) => {
  const response = await axios.put(`${API_URL}/${id}`, productData);
  return response.data;
};

// Delete product
export const deleteProductApi = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
