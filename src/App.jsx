// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./components/common/Navbar.jsx";
// import Footer from "./components/common/Footer.jsx";

// // Auth pages
// import Login from "./pages/Auth/Login.jsx";
// import Register from "./pages/Auth/Register.jsx";

// // Admin pages
// import AdminDashboard from "./pages/Admin/Dashboard.jsx";
// import Product from "./pages/Admin/Product.jsx";
// import Categories from "./pages/Admin/Categories.jsx";
// import Size from "./pages/Admin/Size.jsx";
// import DeliveryZone from "./pages/Admin/DeliveryZone.jsx";
// import User from "./pages/Admin/User.jsx";
// import Order from "./pages/Admin/Order.jsx";
// import DeliveryStaff from "./pages/Admin/DeliveryStaff.jsx";

// // Delivery pages
// import DeliveryDashboard from "./pages/Delivery/Dashboard.jsx";
// import DeliveryProfile from "./pages/Delivery/Profile.jsx";

// const App = () => {
//   // ✅ Get role from localStorage (set after login)
//   const role = localStorage.getItem("role"); // "admin" or "delivery"

//   return (
//     <Router>
//       {/* Navbar (changes based on role) */}
//       <header className="fixed top-0 left-0 w-full z-50">
//         <Navbar role={role} />
//       </header>

//       {/* Main Content */}
//       <main className="pt-20 min-h-screen bg-gray-50 flex flex-col">
//         <Routes>
//           {/* Public Auth routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Redirect root to login */}
//           <Route path="/" element={<Navigate to="/login" />} />

//           {/* Admin routes */}
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/products" element={<Product />} />
//           <Route path="/admin/categories" element={<Categories />} />
//           <Route path="/admin/size" element={<Size />} />
//           <Route path="/admin/deliveryzone" element={<DeliveryZone />} />
//           <Route path="/admin/users" element={<User />} />
//           <Route path="/admin/orders" element={<Order />} />
//           <Route path="/admin/deliverystaff" element={<DeliveryStaff />} />

//           {/* Delivery routes */}
//           <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
//           <Route path="/delivery/profile" element={<DeliveryProfile />} />
//         </Routes>
//       </main>

//       {/* Footer */}
//       <Footer />
//     </Router>
//   );
// };

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar.jsx"; // matches Navbar.jsx
import Footer from "./components/common/Footer.jsx";
import { useSelector } from "react-redux";

// Auth pages
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

// Admin pages
import AdminDashboard from "./pages/Admin/Dashboard.jsx";
import Product from "./pages/Admin/Product.jsx";
import Categories from "./pages/Admin/Categories.jsx";
import Size from "./pages/Admin/Size.jsx";
import DeliveryZone from "./pages/Admin/DeliveryZone.jsx";
import User from "./pages/Admin/User.jsx";
import Order from "./pages/Admin/Order.jsx";
import DeliveryStaff from "./pages/Admin/DeliveryStaff.jsx";

// Delivery pages
import DeliveryDashboard from "./pages/Delivery/Dashboard.jsx";
import DeliveryProfile from "./pages/Delivery/Profile.jsx";

const App = () => {
  const { role } = useSelector((state) => state.auth);

  return (
    <Router>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gray-50">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/products" element={role === "admin" ? <Product /> : <Navigate to="/login" />} />
          <Route path="/admin/categories" element={role === "admin" ? <Categories /> : <Navigate to="/login" />} />
          <Route path="/admin/size" element={role === "admin" ? <Size /> : <Navigate to="/login" />} />
          <Route path="/admin/deliveryzone" element={role === "admin" ? <DeliveryZone /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={role === "admin" ? <User /> : <Navigate to="/login" />} />
          <Route path="/admin/orders" element={role === "admin" ? <Order /> : <Navigate to="/login" />} />
           <Route path="/admin/deliverystaff" element={role === "admin" ? <DeliveryStaff /> : <Navigate to="/login" />} />

          {/* Delivery routes */}
          <Route path="/delivery/dashboard" element={role === "delivery" ? <DeliveryDashboard /> : <Navigate to="/login" />} />
          <Route path="/delivery/profile" element={role === "delivery" ? <DeliveryProfile /> : <Navigate to="/login" />} />


          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
