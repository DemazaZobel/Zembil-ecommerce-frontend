// src/features/shipping/ShipmentApi.js
import axios from "axios";

// Base API URL
const API_BASE = "http://localhost:5000/api/shippingAddresses"; // adjust if needed

// Get all shipping addresses
export const fetchAllShippingAddresses = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (error) {
    console.error("Error fetching shipping addresses:", error);
    throw error;
  }
};

// Get a single shipping address by ID
export const fetchShippingAddressById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching shipping address ${id}:`, error);
    throw error;
  }
};

// Create a new shipping address
export const createShippingAddress = async (addressData) => {
  try {
    const response = await axios.post(API_BASE, addressData);
    return response.data;
  } catch (error) {
    console.error("Error creating shipping address:", error);
    throw error;
  }
};

// Update an existing shipping address
export const updateShippingAddress = async (id, addressData) => {
  try {
    const response = await axios.put(`${API_BASE}/${id}`, addressData);
    return response.data;
  } catch (error) {
    console.error(`Error updating shipping address ${id}:`, error);
    throw error;
  }
};

// Delete a shipping address
export const deleteShippingAddress = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting shipping address ${id}:`, error);
    throw error;
  }
};
