import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../../features/user/userSlice";
import { fetchOrders, cancelOrder } from "../../features/order/orderSlice";
import { getShippingAddresses, editShippingAddress, removeShippingAddress } from "../../features/shipping/shipmentSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { info } = useSelector((state) => state.user);
  const { orders, loading, error, successMessage } = useSelector((state) => state.order);
  const { addresses } = useSelector((state) => state.shipping);

  const [activeTab, setActiveTab] = useState("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: info?.name || "",
    email: info?.email || "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [userAddresses, setUserAddresses] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });

  // ------------------- Fetch Orders & Addresses -------------------
  useEffect(() => {
    if (info?.id) {
      dispatch(fetchOrders(info.id)); // ✅ Fetch only current user's orders
      dispatch(getShippingAddresses());
    }
  }, [dispatch, info?.id]);

  useEffect(() => {
    setUserAddresses(addresses.map((addr) => ({ ...addr, editing: false })));
  }, [addresses]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ------------------- Profile & Password Update -------------------
  const handleUpdateUser = () => {
    if (formData.newPassword || formData.confirmNewPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error("New passwords do not match!");
        return;
      }
    }

    const updatedData = {
      ...info,
      name: formData.name,
      email: formData.email,
    };

    if (formData.newPassword) updatedData.password = formData.newPassword;

    dispatch(updateUser({ userId: info.id, userData: updatedData }))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        setEditingProfile(false);
        setFormData((prev) => ({ ...prev, newPassword: "", confirmNewPassword: "" }));
      })
      .catch((err) => toast.error(err || "Failed to update profile."));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // ------------------- Shipping Address Handlers -------------------
  const handleEditAddress = (id) =>
    setUserAddresses(userAddresses.map(addr => addr.id === id ? { ...addr, editing: true } : addr));

  const handleCancelEdit = (id) =>
    setUserAddresses(userAddresses.map(addr => addr.id === id ? { ...addr, editing: false } : addr));

  const handleSaveAddress = (id) => {
    const addr = userAddresses.find(a => a.id === id);
    dispatch(editShippingAddress({ id, addressData: addr }))
      .unwrap()
      .then(() => {
        toast.success("Address updated successfully!");
        handleCancelEdit(id);
      })
      .catch(() => toast.error("Failed to update address."));
  };

  const openDeleteModal = (addr) => { setSelectedAddress(addr); setShowDeleteModal(true); };
  const closeDeleteModal = () => { setSelectedAddress(null); setShowDeleteModal(false); };
  const confirmDeleteAddress = () => {
    dispatch(removeShippingAddress(selectedAddress.id))
      .unwrap()
      .then(() => toast.success("Address deleted successfully!"))
      .catch(() => toast.error("Failed to delete address."));
    closeDeleteModal();
  };

  // ------------------- Orders Handlers -------------------
  const openCancelModal = (order) => { setSelectedOrder(order); setShowCancelModal(true); };
  const closeCancelModal = () => { setSelectedOrder(null); setShowCancelModal(false); };
  const confirmCancelOrder = () => {
    if (!selectedOrder) return;
    if (["Processing", "Pending"].includes(selectedOrder.orderStatus)) {
      dispatch(cancelOrder(selectedOrder.id))
        .unwrap()
        .then(() => toast.success(`Order #${selectedOrder.id} cancelled successfully!`))
        .catch(() => toast.error(`Failed to cancel Order #${selectedOrder.id}.`));
    } else {
      toast.info(`Order #${selectedOrder.id} cannot be cancelled because it is ${selectedOrder.orderStatus}.`);
    }
    closeCancelModal();
  };

  // ------------------- Password Toggle -------------------
  const togglePassword = (field) => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));

  const filteredAddresses = userAddresses.filter(addr => addr.userId === info?.id);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-800">👤 My Account</h2>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b flex justify-center sm:justify-start bg-gray-50">
          {["profile", "orders", "shipping", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition ${activeTab === tab ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                {editingProfile ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="border px-4 py-3 rounded-lg w-full" placeholder="Full Name" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="border px-4 py-3 rounded-lg w-full" placeholder="Email" />
                  </div>
                ) : (
                  <div className="space-y-3 text-gray-700">
                    <p><span className="font-medium">📧 Name:</span> {formData.name}</p>
                    <p><span className="font-medium">📱 Email:</span> {formData.email || "N/A"}</p>
                  </div>
                )}

                {/* Change Password */}
                <div className="mt-6 border-t pt-6">
                  <h4 className="text-lg font-semibold mb-3">Change Password</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <input type={showPasswords.new ? "text" : "password"} placeholder="New Password" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} className="border px-4 py-3 rounded-lg w-full pr-10" />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => togglePassword("new")}>{showPasswords.new ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                    <div className="relative">
                      <input type={showPasswords.confirm ? "text" : "password"} placeholder="Confirm New Password" value={formData.confirmNewPassword} onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })} className="border px-4 py-3 rounded-lg w-full pr-10" />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => togglePassword("confirm")}>{showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  {editingProfile ? (
                    <>
                      <button onClick={handleUpdateUser} className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition">Save Changes</button>
                      <button onClick={() => setEditingProfile(false)} className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setEditingProfile(true)} className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition">Edit Profile</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {/* Orders Tab */}
{activeTab === "orders" && (
  <div>
    <h3 className="text-xl font-semibold mb-4">My Orders</h3>
    {loading && <p className="text-gray-500">Loading orders...</p>}
    {error && <p className="text-red-500">{error}</p>}
    {successMessage && <p className="text-green-500">{successMessage}</p>}

    {/* Filter orders to only those of the logged-in user */}
    {orders.filter(order => order.userId === info?.id).length > 0 ? (
      <div className="space-y-4">
        {orders
          .filter(order => order.userId === info?.id)
          .map(order => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-gray-500 text-sm">{order.updatedat ? new Date(order.updatedat).toLocaleDateString() : "N/A"}</p>
              </div>
              <div className="mb-2">
                {order.items?.map((item, idx) => (
                  <p key={idx} className="text-gray-700 text-sm">
                    {item.quantity} x {item.productDetail?.name || item.name} (${item.price ? Number(item.price).toFixed(2) : "0.00"})
                  </p>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">${order.totalPrice ? Number(order.totalPrice).toFixed(2) : "0.00"}</p>
                <p className={`text-sm font-semibold ${order.orderStatus === "Shipped" ? "text-secondary" : order.orderStatus === "Cancelled" ? "text-gray-500" : "text-primary"}`}>{order.orderStatus || "Pending"}</p>
              </div>
              <button
                onClick={() => openCancelModal(order)}
                disabled={order.orderStatus === "Cancelled" || order.orderStatus === "Shipped"}
                className={`mt-3 px-4 py-2 rounded-lg text-white transition ${
                  order.orderStatus === "Processing" || order.orderStatus === "Pending"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {order.orderStatus === "Cancelled" ? "Already Cancelled" : "Cancel Order"}
              </button>
            </div>
          ))}
      </div>
    ) : (
      <p className="text-gray-500">You haven’t placed any orders yet.</p>
    )}
  </div>
)}


          {/* Shipping Tab */}
          {activeTab === "shipping" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">My Shipping Addresses</h3>
              {filteredAddresses.length > 0 ? (
                <div className="space-y-4">
                  {filteredAddresses.map(addr => (
                    <div key={addr.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
                      {addr.editing ? (
                        <div className="space-y-2">
                          <input type="text" value={addr.houseNumber} onChange={(e) => setUserAddresses(userAddresses.map(a => a.id === addr.id ? { ...a, houseNumber: e.target.value } : a))} className="border px-3 py-2 rounded-lg w-full" placeholder="House Number" />
                          <input type="text" value={addr.street} onChange={(e) => setUserAddresses(userAddresses.map(a => a.id === addr.id ? { ...a, street: e.target.value } : a))} className="border px-3 py-2 rounded-lg w-full" placeholder="Street" />
                          <input type="text" value={addr.area} onChange={(e) => setUserAddresses(userAddresses.map(a => a.id === addr.id ? { ...a, area: e.target.value } : a))} className="border px-3 py-2 rounded-lg w-full" placeholder="Area" />
                          <input type="text" value={addr.city} onChange={(e) => setUserAddresses(userAddresses.map(a => a.id === addr.id ? { ...a, city: e.target.value } : a))} className="border px-3 py-2 rounded-lg w-full" placeholder="City" />
                          <div className="flex gap-3 mt-2">
                            <button onClick={() => handleSaveAddress(addr.id)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">Save</button>
                            <button onClick={() => handleCancelEdit(addr.id)} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-gray-700">{addr.houseNumber}, {addr.street}</p>
                            <p className="text-gray-700">{addr.area}, {addr.city}, Ethiopia</p>
                            <p className="text-gray-700">Phone: {addr.phoneNumber}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => handleEditAddress(addr.id)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition text-sm">Edit</button>
                            <button onClick={() => openDeleteModal(addr)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm">Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-500">No shipping addresses found.</p>}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="text-center text-gray-600">
              <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
              <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Address Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete the address at <strong>{selectedAddress?.houseNumber}, {selectedAddress?.street}</strong>?</p>
            <div className="flex justify-end gap-4">
              <button onClick={closeDeleteModal} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition">No</button>
              <button onClick={confirmDeleteAddress} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Cancellation</h3>
            <p className="mb-6">Are you sure you want to cancel Order #{selectedOrder?.id}?</p>
            <div className="flex justify-end gap-4">
              <button onClick={closeCancelModal} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition">No</button>
              <button onClick={confirmCancelOrder} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;
