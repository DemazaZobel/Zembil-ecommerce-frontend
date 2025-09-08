import axios from "axios";

// Fetch delivery staff's orders
export const getMyOrders = async () => {
  try {
    const token = localStorage.getItem("token"); // your auth token
    const response = await axios.get("http://localhost:5000/api/delivery/myOrders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // return orders array
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};
