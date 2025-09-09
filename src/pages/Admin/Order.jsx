import React from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axiosConfig";

const fetchOrders = async () => {
  const res = await API.get("/orders"); // token is auto-attached
  return res.data;
};

function Orders() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Order ID</th>
              <th className="py-2 px-4 border-b text-left">User</th>
              <th className="py-2 px-4 border-b text-left">Total</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
            </tr>
          </thead>
         <tbody>
  {Array.isArray(data) && data.length > 0 ? (
    data.map((order) => (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.user ? order.user.name : "N/A"}</td>
        <td>{order.total}</td>
        <td>{order.status}</td>
        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center">No orders found</td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}

export default Orders;