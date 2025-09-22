// src/features/review/reviewApi.js
import axios from "axios";

import API from "./axiosConfig"; // update if needed

// --- Get all reviews ---
export const fetchAllReviews = async () => {
  const res = await API.get("/reviews");
  return res.data;
};

// --- Get reviews for a specific product ---
export const fetchReviewsByProduct = async (productId) => {
  const res = await API.get(`/reviews/product/${productId}`);
  return res.data;
};

// --- Create a review (requires user token) ---
export const createReview = async (data, token) => {
  const res = await API.post("/reviews", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// --- Update a review (requires user token) ---
export const updateReview = async (id, data, token) => {
  const res = await API.put(`/reviews/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// --- Delete a review (requires user token) ---
export const deleteReview = async (id, token) => {
  const res = await API.delete(`/reviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
