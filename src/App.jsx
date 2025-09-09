import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Profile from "./pages/Auth/profile.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import CategoryPage from "./pages/Category/CategoryPage.jsx";
import ProductDetails from "./pages/ProductDetail/ProductDetaiL.jsx";
import AdminDashboard from "./pages/Admin/Dashboard.jsx";
import AdminCategories from "./pages/Admin/Categories.jsx";
import AdminProducts from "./pages/Admin/Product.jsx";
import AdminOrders from "./pages/Admin/Order.jsx";
import AdminUsers from "./pages/Admin/User.jsx";
import AdminDeliveryStaff from "./pages/Admin/DeliveryStaff.jsx";
import AdminSize from "./pages/Admin/Size.jsx";
import AdminDeliveryZone from "./pages/Admin/DeliveryZone.jsx";

// Wrapper component to access location
const AppWrapper = () => {
  const location = useLocation();

  // Pages where Navbar and Footer should be hidden
  const hideNavFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavFooter && (
        <header className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </header>
      )}

      <main className={`pt-20 min-h-screen bg-gray-50 flex flex-col`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/men" element={<CategoryPage category="men" />} />
          <Route path="/women" element={<CategoryPage category="women" />} />
          <Route path="/kids" element={<CategoryPage category="kids" />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/deliverystaff" element={<AdminDeliveryStaff />} />
          <Route path="/admin/size" element={<AdminSize />} />
          <Route path="/admin/deliveryzone" element={<AdminDeliveryZone />} />
        </Routes>
      </main>

      {!hideNavFooter && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
