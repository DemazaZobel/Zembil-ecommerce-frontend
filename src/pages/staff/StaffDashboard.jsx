import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchStaffById, updateStaff } from "../../features/delivery/deliverySlice";
import MessageBox from "../../components/common/MessageBox";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const { user, selectedStaff, loading } = useSelector((state) => state.delivery);
  const navigate = useNavigate();

  const [profileEdit, setProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const [orders, setOrders] = useState([
    {
      id: 101,
      customerName: "Alice Johnson",
      status: "pending",
      details: { items: ["Pizza", "Coke"], total: 25, address: "123 Main St", phone: "123-456-7890" },
    },
    {
      id: 102,
      customerName: "Bob Smith",
      status: "in transit",
      details: { items: ["Burger", "Fries"], total: 15, address: "456 Oak Ave", phone: "987-654-3210" },
    },
    {
      id: 103,
      customerName: "Charlie Lee",
      status: "pending",
      details: { items: ["Sushi"], total: 30, address: "789 Pine Rd", phone: "555-555-5555" },
    },
  ]);

  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (user?.id) dispatch(fetchStaffById(user.id));
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
      navigate("/staff"); // <-- redirects to /staff after logout
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

  const toggleOrderDetails = (orderId) => setExpandedOrder(expandedOrder === orderId ? null : orderId);

  const handleStatusChange = (orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    setInfoMsg(`Order ${orderId} marked as "${status}"`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 -mt-18">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome, {selectedStaff?.name || user?.name}
          </h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition">
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
            <button className="text-blue-600 hover:underline" onClick={() => setProfileEdit(!profileEdit)}>
              {profileEdit ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {loading ? (
            <p>Loading profile...</p>
          ) : profileEdit ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} placeholder="Name" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} placeholder="Email" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
              
              {/* Password with show/hide */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={profileForm.password}
                  onChange={handleProfileChange}
                  placeholder="New Password"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={profileForm.confirmPassword}
                  onChange={handleProfileChange}
                  placeholder="Confirm Password"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
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

        {/* Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Assigned Orders</h2>
          {orders.length === 0 ? (
            <p>No assigned orders currently.</p>
          ) : (
            <ul className="space-y-2">
              {orders.map((order) => (
                <li key={order.id} className="bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer" onClick={() => toggleOrderDetails(order.id)}>
                  <div className="flex justify-between items-center">
                    <span>Order ID: {order.id}</span>
                    <span className="capitalize">{order.status}</span>
                  </div>
                  {expandedOrder === order.id && (
                    <div className="mt-2 text-sm sm:text-base space-y-1 bg-white p-3 rounded shadow-inner">
                      <p><strong>Customer:</strong> {order.customerName}</p>
                      <p><strong>Items:</strong> {order.details.items.join(", ")}</p>
                      <p><strong>Total:</strong> ${order.details.total}</p>
                      <p><strong>Address:</strong> {order.details.address}</p>
                      <p><strong>Phone:</strong> {order.details.phone}</p>
                      <div className="flex gap-2 mt-2">
                        {["pending", "in transit", "delivered"].map((status) => (
                          <button key={status} className={`px-3 py-1 rounded text-xs sm:text-sm ${status === "delivered" ? "bg-green-500 text-white hover:bg-green-600" : status === "in transit" ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-blue-500 text-white hover:bg-blue-600"} transition`} onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, status); }}>
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
