import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { loginSuccess } from "../../features/auth/authSlice"; // Redux action
import { loginUser } from "../../api/authApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // React Query mutation
  const mutation = useMutation({
    mutationFn: loginUser, // API call function
    onSuccess: (data) => {
      // Save user and token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(loginSuccess(data.user));

      // Redirect based on role
      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "delivery") navigate("/delivery/dashboard");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Login failed. Try again.";
      alert(message);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-green-400">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-3xl shadow-2xl w-96 flex flex-col gap-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">
          Login
        </h2>

        {mutation.isError && (
          <div className="text-red-500 text-center">
            {mutation.error.response?.data?.message || "Login failed"}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            mutation.isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-500 text-sm mt-2">
          Don't have an account?{" "}
          <span
            className="text-green-600 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
