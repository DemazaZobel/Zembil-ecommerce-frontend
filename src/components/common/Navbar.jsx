import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import Logo from '../../assets/logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3); // Example count, replace with state/store
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "home", label: "Home", path: "/" },
    { key: "men", label: "Men", path: "/men" },
    { key: "women", label: "Women", path: "/women" },
    { key: "kids", label: "Kids", path: "/kids" },
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 border-b border-b-blue-950 -mt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-20">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo */}
          <div className="flex items-center space-x-3">
            <img src={Logo} alt="Zembil Logo" className="h-12 w-12 object-contain" />
            <span style={{ color: "#3674B5" }} className="text-2xl sm:text-3xl font-bold">
              Zembil
            </span>
          </div>

          {/* Middle: Desktop Menu */}
          <div className="hidden md:flex space-x-10">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`relative text-black font-medium text-sm hover:text-[#3674B5] transition-all duration-200 ${
                    isActive ? "after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-[#3674B5]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Cart & Profile / Mobile Hamburger */}
          <div className="flex items-center space-x-6">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-6 relative">
              <Link to="/cart" className="text-black text-2xl hover:text-[#3674B5] relative">
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-secondary text-black text-xs font-bold rounded-full px-2">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="text-black text-2xl hover:text-[#3674B5]">
                <FaUserCircle />
              </Link>
            </div>

            {/* Mobile Hamburger + Cart Badge */}
            <div className="md:hidden relative flex items-center">
              <Link to="/cart" className="text-2xl text-[#3674B5] mr-4 relative">
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-secondary text-black text-xs font-bold rounded-full px-2">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-3xl text-[#3674B5] focus:outline-none"
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center space-y-5 py-6">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium hover:text-[#3674B5] transition-all duration-200 ${
                    isActive ? "underline decoration-[#3674B5] underline-offset-4" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {/* Mobile Profile */}
            <div className="flex space-x-8 mt-3">
              <Link to="/profile" style={{ color: "#3674B5" }} className="text-2xl hover:opacity-80">
                <FaUserCircle />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
