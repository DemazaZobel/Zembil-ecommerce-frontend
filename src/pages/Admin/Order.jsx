import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../features/order/orderSlice";
import { getShippingAddresses } from "../../features/shipping/shipmentSlice";

const OrdersDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const { addresses: shippingAddresses } = useSelector((state) => state.shipping);

  const [filterDate, setFilterDate] = useState(""); // yyyy-mm-dd format

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(getShippingAddresses());
  }, [dispatch]);

  const findShippingAddress = (id) => {
    return shippingAddresses.find((addr) => addr.id === id) || null;
  };

  // Filter orders by selected date
  const filteredOrders = filterDate
    ? orders.filter(
        (order) =>
          new Date(order.createdat).toDateString() ===
          new Date(filterDate).toDateString()
      )
    : orders;

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">All Orders</h1>

      {/* --- Date Filter --- */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Filter by date:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Clear
          </button>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredOrders.map((order) => {
            const shipping = findShippingAddress(order.shippingAddressId);

            return (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg p-4 overflow-x-auto"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                  <div>
                    <h2 className="font-semibold text-lg">
                      Order #{order.id} - {order.orderStatus}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Placed by: {order.user?.name || "Unknown"} ({order.user?.email || "N/A"})
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {order.user?.phone || shipping?.phoneNumber || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {order.createdat ? new Date(order.createdat).toLocaleString() : "N/A"}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <p className="text-sm text-gray-700">
                      Total: ${order.totalPrice ? Number(order.totalPrice).toFixed(2) : "0.00"}
                    </p>
                    <p className="text-sm text-gray-700">
                      Payment: {order.paymentMethod || "N/A"} ({order.paymentStatus || "N/A"})
                    </p>
                    <p className="text-sm text-gray-700">
                      Assigned to: {order.deliveryStaff?.name || "Not Assigned"}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-3 border-b text-left text-sm">Product</th>
                        <th className="py-2 px-3 border-b text-left text-sm">Size</th>
                        <th className="py-2 px-3 border-b text-left text-sm">Qty</th>
                        <th className="py-2 px-3 border-b text-left text-sm">Price</th>
                        <th className="py-2 px-3 border-b text-left text-sm">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3 text-sm">{item.productDetail?.name || "N/A"}</td>
                          <td className="py-2 px-3 text-sm">{item.sizeDetail?.name || "N/A"}</td>
                          <td className="py-2 px-3 text-sm">{item.quantity || 0}</td>
                          <td className="py-2 px-3 text-sm">
                            ${item.price ? Number(item.price).toFixed(2) : "0.00"}
                          </td>
                          <td className="py-2 px-3 text-sm">
                            ${(item.price && item.quantity ? Number(item.price) * item.quantity : 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    Shipping: {shipping
                      ? `${shipping.houseNumber || ""}, ${shipping.street || ""}, ${shipping.area || ""}, ${shipping.city || ""}, Ethiopia`
                      : "No shipping info"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersDashboard;
