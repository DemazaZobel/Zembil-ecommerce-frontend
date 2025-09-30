// src/pages/staff/DeliveryDashboardRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const DeliveryDashboardRoute = ({ children }) => {
  const { token } = useSelector((state) => state.delivery);

  if (!token) return <Navigate to="/staff/login" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== "delivery") return <Navigate to="/staff/login" />;
  } catch (err) {
    return <Navigate to="/staff/login" />;
  }

  return children;
};

export default DeliveryDashboardRoute;
