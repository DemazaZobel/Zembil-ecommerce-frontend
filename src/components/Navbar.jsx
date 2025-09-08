import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth); // store the whole user object
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Only determine role if user is logged in
  const role = user?.role || null;

  const menuItems =
    role === "admin"
      ? [
          { key: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
          { key: "products", label: "Products", path: "/admin/products" },
          { key: "categories", label: "Categories", path: "/admin/categories" },
          { key: "size", label: "Sizes", path: "/admin/size" },
          { key: "deliveryzone", label: "Delivery Zones", path: "/admin/deliveryzone" },
          { key: "users", label: "Users", path: "/admin/users" },
          { key: "orders", label: "Orders", path: "/admin/orders" },
        { key: "deliverystaff", label: "Delivery Staff", path: "/admin/deliverystaff" },

        ]
      : role === "delivery"
      ? [
          { key: "dashboard", label: "Dashboard", path: "/delivery/dashboard" },
          { key: "profile", label: "Profile", path: "/delivery/profile" },

        ]
      : []; // No menu items if not logged in

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="font-bold text-2xl tracking-wide">
          {role === "admin"
            ? "Admin Page"
            : role === "delivery"
            ? "Delivery Page"
            : "Zembil Ecommerce"}
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 font-medium">
          {menuItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "underline underline-offset-4 decoration-2"
                  : "hover:underline hover:underline-offset-4"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-3">
          {!user ? (
            <>
              <NavLink
                to="/login"
                className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-green-400 hover:bg-green-500 px-4 py-2 rounded-lg transition"
              >
                Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl font-bold focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖️" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="md:hidden bg-blue-500 p-4 rounded-b-lg shadow-lg space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className="block px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-full bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
