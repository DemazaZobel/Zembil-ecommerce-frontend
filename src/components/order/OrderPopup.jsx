import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderPopup = ({ visible, onClose, orderNumber }) => {
  const navigate = useNavigate();

  if (!visible) return null;

  const handleContinue = () => {
    onClose();           // close the popup
    navigate("/");       // navigate to home
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 sm:w-96 p-6 text-center relative animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition text-lg font-bold"
        >
          ×
        </button>

        <FaCheckCircle className="mx-auto text-primary text-6xl mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-900">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order{" "}
          <span className="font-medium text-gray-800">#{orderNumber}</span> has been confirmed.
        </p>
        <button
          onClick={handleContinue}
          className="bg-primary text-white py-2 px-6 rounded-lg font-medium hover:bg-primary/90 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderPopup;
