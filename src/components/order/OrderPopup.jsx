import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearOrderState } from "../../features/order/orderSlice";

const OrderPopup = ({ visible, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderState = useSelector((state) => state.order) || {};
  const { currentOrder = null, successMessage = "" } = orderState;

  // 🟢 Debug: log the order whenever it changes
  useEffect(() => {
    if (currentOrder) {
      console.log("📦 Order object (from backend response):", currentOrder);
      console.log("🛒 Items being ordered:", currentOrder.items);
      console.log("🚚 Shipping details:", currentOrder.shippingAddress);
    }
  }, [currentOrder]);

  const handleContinue = () => {
    onClose();
    dispatch(clearOrderState());
    navigate("/");
  };

  if (!visible || !currentOrder) return null;

  // Calculate totals
  const subtotal = currentOrder.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-scaleIn">
        <button
          onClick={handleContinue}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition text-lg font-bold"
        >
          ×
        </button>

        <FaCheckCircle className="mx-auto text-primary text-6xl mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          {successMessage || "Thank you for your purchase."} Your order{" "}
          <span className="font-medium text-gray-800">#{currentOrder.id}</span>{" "}
          has been confirmed.
        </p>

        {/* Order Details with Images */}
        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Products</h3>
          <div className="max-h-56 overflow-y-auto space-y-3">
            {currentOrder.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-gray-700 font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t mt-3 pt-2">
            <div className="flex justify-between text-gray-900 font-medium">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-lg mt-1">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Shipping Details</h3>
          <p className="text-gray-700">{currentOrder.shippingAddress.fullName}</p>
          <p className="text-gray-700">
            {currentOrder.shippingAddress.houseNumber &&
              `House ${currentOrder.shippingAddress.houseNumber}, `}
            {currentOrder.shippingAddress.street}, {currentOrder.shippingAddress.area},{" "}
            {currentOrder.shippingAddress.specificTown &&
              `${currentOrder.shippingAddress.specificTown}, `}
            {currentOrder.shippingAddress.city}, Ethiopia
          </p>
          <p className="text-gray-700">Phone: {currentOrder.shippingAddress.phoneNumber}</p>
        </div>

        <button
          onClick={handleContinue}
          className="bg-primary text-white py-3 px-6 w-full rounded-lg font-medium hover:bg-primary/90 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderPopup;
