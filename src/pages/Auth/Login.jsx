import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginImg from "../../assets/login.png"; // replace with your image path

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Top Center Slogan */}
      <h1 className="text-xl sm:text-2xl italic text-gray-600 mb-10 text-center">
        Caring Style, Delivering Smiles
      </h1>

      <div className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden w-full max-w-5xl">
        {/* Left Side - Image */}
        <div className="lg:w-1/2 relative flex items-center justify-center bg-gray-200">
          <img
            src={loginImg}
            alt="Login"
            className="w-full h-full object-cover"
          />
          {/* Overlay big round */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary w-40 h-40 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-lg">
             <span className="text-center">Zembil Market</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Login</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
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

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
