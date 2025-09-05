import React, { useState } from "react";
import { FaHeart, FaTrash } from "react-icons/fa";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    address: "123 Main St, New York, USA",
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(formData);
    setEditing(false);
  };

  // Dummy orders
  const orders = [
    {
      id: "ORD12345",
      date: "2025-09-01",
      status: "Shipped",
      total: "$120",
      items: [
        { name: "Stylish Shirt", quantity: 2 },
        { name: "Classic Denim Jeans", quantity: 1 },
      ],
    },
    {
      id: "ORD12346",
      date: "2025-09-05",
      status: "Processing",
      total: "$75",
      items: [{ name: "Comfort Hoodie", quantity: 1 }],
    },
  ];

  // Dummy wishlist
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Premium Leather Jacket",
      price: "$70",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Running Sneakers",
      price: "$60",
      image: "https://via.placeholder.com/150",
    },
  ]);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-800">
        👤 My Account
      </h2>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b flex flex-wrap justify-center sm:justify-start bg-gray-50">
          {["profile", "orders", "wishlist", "settings"].map((tab) => (
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
              <div className="flex-1 flex flex-col items-center lg:items-start">
                <img
                  src="https://via.placeholder.com/150"
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                <h3 className="text-2xl font-semibold mt-4 text-gray-800">
                  {user.name}
                </h3>
                <p className="text-gray-500">{user.email}</p>
              </div>

              <div className="flex-1">
                {editing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-full lg:w-[95%]"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-full lg:w-[95%]"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-full lg:w-[95%]"
                      placeholder="Phone"
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-full lg:w-[95%]"
                      placeholder="Address"
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
                      <span className="font-medium">📧 Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium">📱 Phone:</span> {user.phone}
                    </p>
                    <p>
                      <span className="font-medium">🏠 Address:</span>{" "}
                      {user.address}
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
                        <p className="text-gray-500 text-sm">{order.date}</p>
                      </div>

                      <div className="mb-2">
                        {order.items.map((item, index) => (
                          <p key={index} className="text-gray-700 text-sm">
                            {item.quantity} x {item.name}
                          </p>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-gray-700 font-medium">{order.total}</p>
                        <p
                          className={`text-sm font-semibold ${
                            order.status === "Shipped"
                              ? "text-secondary"
                              : "text-primary"
                          }`}
                        >
                          {order.status}
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

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">My Wishlist</h3>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden relative"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-36 object-cover"
                      />
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {item.name}
                        </p>
                        <p className="text-primary font-semibold">{item.price}</p>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-red-50 transition"
                      >
                        <FaTrash className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Your wishlist is empty.</p>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="text-center text-gray-600">
              <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
              <button className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition">
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
