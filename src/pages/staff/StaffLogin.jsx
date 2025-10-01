// src/pages/staff/StaffLogin.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deliveryLogin } from "../../features/delivery/deliverySlice";
import { useNavigate } from "react-router-dom";
import loginImage from "../../assets/login.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const MessageBox = ({ message, type = "error", onClose }) => {
  const colors = {
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
  };

  return (
    <div
      className={`flex justify-between items-center p-3 rounded shadow-sm mb-4 ${colors[type]} animate-fadeIn`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="font-bold ml-4 hover:text-gray-800">
        ×
      </button>
    </div>
  );
};

const StaffLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.delivery);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg(""); // Clear error on typing
    setInfoMsg("");  // Clear info
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(deliveryLogin(form)).unwrap();
      navigate("/staff/dashboard");
    } catch (err) {
      let friendlyMessage = "Invalid credentials.";
      if (err?.response?.status === 400) {
        friendlyMessage = "Please enter both email and password.";
      } else if (err?.response?.status === 401 || err?.response?.status === 404) {
        friendlyMessage = "Email or password is incorrect.";
      } else if (err?.response?.status === 500) {
        friendlyMessage = "Server error. Please try again later.";
      }
      setErrorMsg(friendlyMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 -mt-20">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-4xl transition-transform transform hover:scale-105">

        {/* Left Side Image */}
        <div className="hidden md:flex md:w-1/2 bg-blue-100 items-center justify-center">
          <img
            src={loginImage}
            alt="Delivery illustration"
            className="w-full h-auto rounded-xl"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Delivery Staff Login
          </h2>

          {/* Error Message Box */}
          {errorMsg && (
            <MessageBox
              message={errorMsg}
              type="error"
              onClose={() => setErrorMsg("")}
            />
          )}

          {/* Info Message Box */}
          {infoMsg && (
            <MessageBox
              message={infoMsg}
              type="info"
              onClose={() => setInfoMsg("")}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />

            {/* Password input with eye toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() =>
                setInfoMsg("Please contact the admin to reset your password.")
              }
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;