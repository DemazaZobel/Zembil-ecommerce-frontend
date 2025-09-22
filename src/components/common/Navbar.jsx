import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { logout } from "../../features/user/userSlice";
import Logo from "../../assets/logo.png";
import { Toaster, toast } from "react-hot-toast";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { info } = useSelector((state) => state.user);
  const { totalQuantity } = useSelector((state) => state.cart);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
        setProductsDropdownOpen({});
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    window.location.reload();
    navigate("/");
  };

  const handleProfileClick = () => {
    if (info) setProfileMenuOpen(!profileMenuOpen);
    else {
      toast.error("Please login first");
      navigate("/login", { state: { from: location } });
    }
  };

  const menuItems = [
    { key: "home", label: "Home", path: "/" },
    {
      key: "products",
      label: "Products",
      dropdown: [
        { key: "men", label: "Men", path: "/men" },
        { key: "women", label: "Women", path: "/women" },
        { key: "kids", label: "Kids", path: "/kids" },
      ],
    },
    { key: "about", label: "About", path: "/about" },
    { key: "contact", label: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = (key) => {
    setProductsDropdownOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 border-b border-gray-200">
      <Toaster />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-20">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={Logo} alt="Zembil Logo" className="h-12 w-12 object-contain" />
            <span className="text-2xl sm:text-3xl font-bold text-[#3674B5]">Zembil</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center relative">
            {menuItems.map((item) => (
              <div key={item.key} className="relative group">
                {item.dropdown ? (
                  <>
                    <button
                      className={`flex items-center font-medium text-sm transition-colors duration-200 ${
                        item.dropdown.some((d) => isActive(d.path))
                          ? "text-[#3674B5]"
                          : "text-black"
                      }`}
                    >
                      {item.label}
                      <FaChevronDown className="ml-1 text-xs" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transform transition-all duration-200 scale-95 group-hover:scale-100">
                      {item.dropdown.map((d) => (
                        <Link
                          key={d.key}
                          to={d.path}
                          className={`block px-5 py-2 text-gray-700 hover:text-[#3674B5] hover:bg-gray-50 ${
                            isActive(d.path) ? "text-[#3674B5]" : ""
                          }`}
                        >
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`relative font-medium text-sm hover:text-[#3674B5] transition-colors duration-200 ${
                      isActive(item.path)
                        ? "after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#3674B5]"
                        : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Admin Dashboard */}
            {info?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className={`font-medium text-sm hover:text-[#3674B5] transition-colors duration-200 ${
                  isActive("/admin/dashboard") ? "text-[#3674B5]" : "text-black"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-6 relative" ref={profileRef}>
            {/* Cart */}
            <Link
              to="/cart"
              className="text-black text-2xl hover:text-[#3674B5] relative"
            >
              <FaShoppingCart />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-3 bg-secondary text-black text-xs font-bold rounded-full px-2">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="text-black text-2xl hover:text-[#3674B5] focus:outline-none"
                aria-label="Profile menu"
              >
                <FaUserCircle />
              </button>
              {profileMenuOpen && info && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md py-2 z-50">
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
        <div className="md:hidden bg-white shadow-md animate-slideDown">
          <div className="flex flex-col items-center space-y-4 py-6">
            {menuItems.map((item) =>
              item.dropdown ? (
                <div key={item.key} className="w-full text-center">
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    className="w-full text-lg font-medium hover:text-[#3674B5] transition-all duration-200 flex justify-center items-center space-x-1"
                  >
                    <span>{item.label}</span>
                    <FaChevronDown />
                  </button>
                  {productsDropdownOpen[item.key] &&
                    item.dropdown.map((d) => (
                      <Link
                        key={d.key}
                        to={d.path}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          toggleDropdown(item.key);
                        }}
                        className="block py-2 text-gray-700 hover:bg-gray-100 w-full"
                      >
                        {d.label}
                      </Link>
                    ))}
                </div>
              ) : (
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
              )
            )}

            {/* Admin Dashboard */}
            {info?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-2 rounded-2xl hover:bg-gray-200 transition text-center w-full text-black"
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
                className="px-6 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition text-center w-full"
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
