// src/pages/delivery/DeliveryStaff.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, fetchStaffById, updateStaff } from "../../features/delivery/deliverySlice";
import { fetchOrders, updateOrder } from "../../features/order/orderSlice";
import { getShippingAddresses } from "../../features/shipping/shipmentSlice";
import { fetchProducts } from "../../features/product/productSlice";
import MessageBox from "../../components/common/MessageBox";
import { useNavigate } from "react-router-dom";

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, selectedStaff, loading: staffLoading } = useSelector((state) => state.delivery);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.order);
  const { addresses } = useSelector((state) => state.shipping);
  const products = useSelector((state) => state.products.products || []);

  const [profileEdit, setProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Fetch staff, orders, shipping, products
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchStaffById(user.id));
      dispatch(fetchOrders());
      dispatch(getShippingAddresses());
      dispatch(fetchProducts());
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (selectedStaff) {
      setProfileForm({
        name: selectedStaff.name || "",
        email: selectedStaff.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [selectedStaff]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/staff");
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter";
    return null;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!profileForm.name || !profileForm.email) {
      setErrorMsg("Name and Email are required.");
      return;
    }

    if (profileForm.password) {
      const passwordError = validatePassword(profileForm.password);
      if (passwordError) {
        setErrorMsg(passwordError);
        return;
      }
      if (profileForm.password !== profileForm.confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    }

    try {
      const payload = {
        name: profileForm.name,
        email: profileForm.email,
        ...(profileForm.password ? { password: profileForm.password } : {}),
      };
      await dispatch(updateStaff({ id: user.id, payload })).unwrap();
      setInfoMsg("Profile updated successfully.");
      setProfileEdit(false);
      setProfileForm({ ...profileForm, password: "", confirmPassword: "" });
    } catch (err) {
      setErrorMsg(err || "Failed to update profile.");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await dispatch(updateOrder({ id: orderId, payload: { orderStatus: status } })).unwrap();
      setInfoMsg(`Order ${orderId} status updated to "${status}"`);
      dispatch(fetchOrders());
    } catch (err) {
      setErrorMsg(err || "Failed to update order status");
    }
  };

  const assignedOrders = Array.isArray(orders)
    ? orders.filter((o) => o.assignedTo === user?.id && o.orderStatus !== "Cancelled")
    : [];

  const getShippingDetails = (shippingId) => {
    return addresses.find((addr) => addr.id === shippingId) || {};
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 -mt-18">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome, {selectedStaff?.name || user?.name}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        {errorMsg && <MessageBox message={errorMsg} type="error" onClose={() => setErrorMsg("")} />}
        {infoMsg && <MessageBox message={infoMsg} type="info" onClose={() => setInfoMsg("")} />}

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Profile</h2>
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setProfileEdit(!profileEdit)}
            >
              {profileEdit ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {staffLoading ? (
            <p>Loading profile...</p>
          ) : profileEdit ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Profile form inputs */}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={profileForm.name}
                onChange={handleProfileChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={profileForm.password}
                onChange={handleProfileChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={profileForm.confirmPassword}
                onChange={handleProfileChange}
                className="w-full border rounded px-3 py-2"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-1 text-sm sm:text-base">
              <p><span className="font-semibold">Name:</span> {selectedStaff?.name || user?.name}</p>
              <p><span className="font-semibold">Email:</span> {selectedStaff?.email || user?.email}</p>
              <p><span className="font-semibold">Zone:</span> {selectedStaff?.zone?.name || user?.zone?.name || "N/A"}</p>
              <p><span className="font-semibold">Area:</span> {selectedStaff?.zone?.areas || user?.zone?.areas || "N/A"}</p>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Assigned Orders</h2>

          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : ordersError ? (
            <p className="text-red-500">Error: {ordersError}</p>
          ) : assignedOrders.length === 0 ? (
            <p>No assigned orders currently.</p>
          ) : (
            <div className="space-y-4">
              {assignedOrders.map((order) => {
                const shipping = getShippingDetails(order.shippingAddressId);

                return (
                  <div
                    key={order.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "In Transit"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.orderStatus || "N/A"}
                      </span>
                    </div>

                    {/* Expandable Details */}
                    {expandedOrder === order.id && (
                      <div className="mt-4 space-y-5">
                        {/* Shipment Details */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                          <h4 className="font-semibold mb-2">Shipment Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <p><span className="font-semibold">Full Name:</span> {shipping.fullName || "N/A"}</p>
                            <p><span className="font-semibold">Phone:</span> {shipping.phoneNumber || "N/A"}</p>
                            <p><span className="font-semibold">House #:</span> {shipping.houseNumber || "N/A"}</p>
                            <p><span className="font-semibold">Street:</span> {shipping.street || "N/A"}</p>
                            <p><span className="font-semibold">Area:</span> {shipping.area || "N/A"}</p>
                            <p><span className="font-semibold">Town:</span> {shipping.specificTown || "N/A"}</p>
                            <p><span className="font-semibold">City:</span> {shipping.city || "N/A"}</p>
                            <p><span className="font-semibold">Country:</span> {shipping.country || "N/A"}</p>
                            <p><span className="font-semibold">Postal Code:</span> {shipping.postalCode || "N/A"}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                          <h4 className="text-md font-semibold mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {(order.items || []).map((item, idx) => {
                              const product = products.find((p) => p.id === item.productId);
                              const sizeObj = product?.sizes?.find((s) => s.id === item.sizeId);
                              return (
                                <div
                                  key={idx}
                                  className="flex gap-4 items-start bg-gray-50 border rounded-lg p-3"
                                >
                                  {/* Product Image */}
                                  <img
                                    src={product?.images?.[0] ? `http://localhost:5000/${product.images[0]}` : "/placeholder.png"}
                                    alt={product?.name || "Product"}
                                    className="w-20 h-20 object-cover rounded-md"
                                  />

                                  {/* Product Info */}
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">{product?.name || "Unknown Product"}</p>
                                    <p className="text-sm text-gray-500">
                                      {product?.category?.name || "Category"} / {product?.category?.type || ""}
                                    </p>
                                    <p className="text-sm text-gray-500 line-clamp-2">
                                      {product?.description || "No description available."}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {product?.tags?.map((tag, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-1 text-xs bg-gray-200 rounded-md"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>

                                    {/* Size + Quantity */}
                                    <p className="text-sm text-gray-600 mt-1">
                                      Size: {sizeObj?.label || item.sizeId} | Qty: {item.quantity} × ${item.price}
                                    </p>
                                  </div>

                                  {/* Item Subtotal */}
                                  <div className="text-right">
                                    <p className="font-semibold">
                                      ${(item.quantity * (item.price || 0)).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="flex justify-between items-center mt-4 border-t pt-3">
                          <span className="font-semibold">Total:</span>
                          <span className="text-lg font-bold text-blue-600">
                            ${order.totalPrice || 0}
                          </span>
                        </div>

                        {/* Metadata */}
                        <div className="text-sm text-gray-500">
                          <p><span className="font-semibold">Placed on:</span> {new Date(order.createdAt).toLocaleString()}</p>
                          <p><span className="font-semibold">Last Updated:</span> {new Date(order.updatedAt).toLocaleString()}</p>
                        </div>

                        {/* Update Status Buttons */}
                        <div className="flex gap-2 mt-4">
                          {["Processing", "In Transit", "Delivered"].map((status) => (
                            <button
                              key={status}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                status === "Delivered"
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : status === "In Transit"
                                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                  : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.id, status);
                              }}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
