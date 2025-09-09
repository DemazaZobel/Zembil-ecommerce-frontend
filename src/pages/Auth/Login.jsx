import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/user/userSlice";
import loginImg from "../../assets/login.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster } from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // to know where the user came from
  const { loading, error, info } = useSelector((state) => state.user);
  const [alertMessage, setAlertMessage] = useState("");

  // Get redirect path from state, or default to "/"
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // Redirect user after successful login
  useEffect(() => {
    if (info) {
      navigate(from, { replace: true });
    }
  }, [info, navigate, from]);

  useEffect(() => {
    if (location.state?.message) {
      setAlertMessage(location.state.message);

      // Clear state after showing the message
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 -mt-12 -mt-20 lg:-mt-40">
      <div className="max-w-md mx-auto mt-20 p-6  rounded">
      
      {/* Your login form here */}
    </div>
      <h1 className="text-xl sm:text-2xl italic text-gray-600 mb-10 text-center">
        Caring Style, Delivering Smiles
      </h1>

      <div className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden w-full max-w-5xl">
        {/* Left Side */}
        <div className="lg:w-1/2 relative flex items-center justify-center bg-gray-200">
          <img
            src={loginImg}
            alt="Login"
            className="w-full h-62 sm:w-full sm:h-40 md:w-full md:h-64 lg:w-full lg:h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-40 lg:h-40 rounded-lg flex items-center justify-center text-white text-sm sm:text-lg md:text-xl lg:text-2xl font-bold shadow-lg text-center">
              Zembil Market
            </div>
          </div>
        </div>

        {/* Right Side */}
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

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
            <div>
              <Link to="/" className="text-black text-[12px] text-gray-400">
                Back to <span className="italic text-primary/80 underline">Home</span>
              </Link>
            </div>
          </p>
        </div>
      </div>
    </div>
    </>
   
  );
};

export default Login;
