import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar.jsx";
import Home from "./pages/Home/Home.jsx";
import ProductDetail from "./pages/ProductDetail/ProductDetail.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Profile from "./pages/Auth/profile.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Footer from "./components/common/Footer.jsx";
import CategoryPage from "./pages/Category/CategoryPage.jsx";

const App = () => {
  return (
    <Router>
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="pt-20 min-h-screen bg-gray-50 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/men" element={<CategoryPage category="men" />} />
          <Route path="/women" element={<CategoryPage category="women" />} />
          <Route path="/kids" element={<CategoryPage category="kids" />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </Router>
  );
};

export default App;
