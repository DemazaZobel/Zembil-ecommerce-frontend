// src/pages/user/Profile.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import { fetchOrders } from "../../features/order/orderSlice";
import { getShippingAddresses } from "../../features/shipping/shipmentSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { info } = useSelector((state) => state.user); // logged-in user
  const { orders } = useSelector((state) => state.order); // orders slice
  const { addresses } = useSelector((state) => state.shipping); // shipping slice

  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: info?.name || "",
    email: info?.email || "",
    phone: info?.phone || "",
  });

  useEffect(() => {
    if (info?.id) {
      dispatch(fetchOrders(info.id));
      dispatch(getShippingAddresses());
    }
  }, [dispatch, info?.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Dispatch updateUser action here if needed
    setEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Get shipping addresses for this user
  const userAddresses = addresses.filter((addr) => addr.userId === info?.id);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-800">
        👤 My Account
      </h2>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b flex justify-center sm:justify-start bg-gray-50">
          {["profile", "orders", "shipping", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                {editing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none w-full"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none w-full"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none w-full"
                      placeholder="Phone"
                    />
                    <div className="col-span-1 sm:col-span-2 flex gap-4">
                      <button
                        onClick={handleSave}
                        className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <span className="font-medium">📧 Email:</span> {formData.email}
                    </p>
                    <p>
                      <span className="font-medium">📱 Phone:</span> {formData.phone || "N/A"}
                    </p>
                    <button
                      onClick={() => setEditing(true)}
                      className="mt-4 bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">My Orders</h3>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">{order.id}</p>
                        <p className="text-gray-500 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mb-2">
                        {order.items?.map((item, index) => (
                          <p key={index} className="text-gray-700 text-sm">
                            {item.quantity} x {item.productDetail?.name || item.name} (${item.price ? Number(item.price).toFixed(2) : "0.00"})
                          </p>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-700 font-medium">
                          ${order.totalPrice ? Number(order.totalPrice).toFixed(2) : "0.00"}
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            order.orderStatus === "Shipped" ? "text-secondary" : "text-primary"
                          }`}
                        >
                          {order.orderStatus}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">You haven’t placed any orders yet.</p>
              )}
            </div>
          )}

          {/* Shipping Addresses Tab */}
          {activeTab === "shipping" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">My Shipping Addresses</h3>
              {userAddresses.length > 0 ? (
                <div className="space-y-4">
                  {userAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <p className="text-gray-700">{addr.houseNumber}, {addr.street}</p>
                      <p className="text-gray-700">{addr.area}, {addr.city}, Ethiopia</p>
                      <p className="text-gray-700">Phone: {addr.phoneNumber}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No shipping addresses found.</p>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="text-center text-gray-600">
              <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
