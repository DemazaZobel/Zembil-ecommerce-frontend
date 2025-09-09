import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { logout } from "../../features/user/userSlice";
import Logo from '../../assets/logo.png';
import { Toaster, toast } from "react-hot-toast";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { info } = useSelector((state) => state.user);
  const { totalQuantity } = useSelector((state) => state.cart);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); 
  };

  const handleProfileClick = () => {
    if (info) {
      setProfileMenuOpen(!profileMenuOpen);
    } else {
      toast.error("Please first login"); 
      navigate("/login", { state: { from: location } });
    }
  };

  const menuItems = [
    { key: "home", label: "Home", path: "/" },
    { key: "men", label: "Men", path: "/men" },
    { key: "women", label: "Women", path: "/women" },
    { key: "kids", label: "Kids", path: "/kids" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 border-b border-b-blue-950">
      <Toaster />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-20">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={Logo} alt="Zembil Logo" className="h-12 w-12 object-contain" />
            <span style={{ color: "#3674B5" }} className="text-2xl sm:text-3xl font-bold">
              Zembil
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`relative text-black font-medium text-sm hover:text-[#3674B5] transition-all duration-200 ${
                  isActive(item.path) ? "after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-[#3674B5]" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Admin Dashboard */}
            {info?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className={`relative text-black font-medium text-sm hover:text-[#3674B5] transition-all duration-200 ${
                  isActive("/admin/dashboard") ? "after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-[#3674B5]" : ""
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {/* Cart */}
            <Link to="/cart" className="text-black text-2xl hover:text-[#3674B5] relative">
              <FaShoppingCart />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-3 bg-secondary text-black text-xs font-bold rounded-full px-2">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Profile icon */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="text-black text-2xl hover:text-[#3674B5] focus:outline-none"
              >
                <FaUserCircle />
              </button>

              {/* Dropdown menu */}
              {profileMenuOpen && info && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {info?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="text-2xl text-[#3674B5] mr-4 relative">
              <FaShoppingCart />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-3 bg-secondary text-black text-xs font-bold rounded-full px-2">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <button
              onClick={handleProfileClick}
              className="text-2xl text-[#3674B5] mr-4"
            >
              <FaUserCircle />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-3xl text-[#3674B5] focus:outline-none"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center space-y-5 py-6">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-medium hover:text-[#3674B5] transition-all duration-200 ${
                  isActive(item.path) ? "text-[#3674B5]" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Admin Dashboard */}
            {info?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-6 py-2 rounded-2xl hover:bg-gray-200 transition text-center ${
                  isActive("/admin/dashboard") ? "bg-[#3674B5] text-white" : "bg-gray-200 text-black"
                }`}
              >
                Dashboard
              </Link>
            )}

            {/* Mobile Logout */}
            {info && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-6 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition text-center mt-3"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
