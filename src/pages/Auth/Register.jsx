import React, { useState } from "react";
import { Link } from "react-router-dom";
import registerImg from "../../assets/logo.png"; // replace with your image path

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 -mt-20">
      {/* Top Center Welcome */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10 text-center">
        Welcome to Zambil Market
      </h1>

      <div className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden w-full max-w-5xl">
        {/* Left Side - Image */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <img
            src={registerImg}
            alt="Register"
            className="w-200px h-full object-cover p-4"
          />
          <div className="p-6 text-center -mt-4">
            <h2 className="text-2xl font-semibold text-gray-700 text-primary">
             Zembil Market
            </h2>
            <p className="mt-2 text-gray-500">
              Create an account to start shopping and enjoy exclusive offers.
            </p>
            </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Register</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Register
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
