import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import registerImg from "../../assets/logo.png"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/user/userSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check password strength in real-time
  useEffect(() => {
    const errors = [];
    if (formData.password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(formData.password)) errors.push("At least one uppercase letter");
    if (!/[a-z]/.test(formData.password)) errors.push("At least one lowercase letter");
    if (!/[0-9]/.test(formData.password)) errors.push("At least one number");
    if (!/[\W_]/.test(formData.password)) errors.push("At least one special character");
    setPasswordErrors(errors);
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordErrors.length > 0) {
      alert("Please fix the password errors before submitting.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/"); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 -mt-32">
      <h1 className="md:text-xl lg:text-2xl sm:text-xl italic text-gray-600 mb-10 text-center lg:mt-24 md:mt-24 mt-20">
        Caring Style, Delivering Smiles
      </h1>

      <div className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden w-full max-w-5xl">
        {/* Left Side - Image */}
        <div className="lg:w-1/2 flex flex-col items-center">
          <img
            src={registerImg}
            alt="Register"
            className="w-40 h-62 sm:w-48 sm:h-68 md:w-64 md:h-64 lg:h-[350px] object-cover p-6"
          />
          <div className="p-6 text-center -mt-14 z-20">
            <h2 className="text-2xl font-semibold text-primary">Zembil Market</h2>
            <p className="mt-2 text-gray-500">
              Create an account to start shopping <br />
              enjoy exclusive offers.
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

            {/* Password Field */}
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

            {/* Password Validation Feedback */}
            {formData.password && (
              <ul className="text-xs mt-1 mb-2 space-y-1 text-red-500">
                {passwordErrors.length === 0 ? (
                  <li className="text-green-500">✅ Strong password</li>
                ) : (
                  passwordErrors.map((err, idx) => <li key={idx}>❌ {err}</li>)
                )}
              </ul>
            )}

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Display server error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
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
  );
};

export default Register;
