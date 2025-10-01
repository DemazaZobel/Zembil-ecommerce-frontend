// src/components/order/OrderPopup.jsx
import React, { useMemo } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearOrderState } from "../../features/order/orderSlice";
import { clearCart } from "../../features/cart/cartSlice";

const OrderPopup = ({ visible, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { successMessage } = useSelector((state) => state.order);
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.products);

  // Merge cart items with product details
  const enrichedItems = useMemo(
    () =>
      cartItems.map((item) => {
        const product = products.find((p) => p.id === item.productId) || {};
        return {
          ...item,
          name: product.name || "Unknown Product",
          imageUrl: product.images?.[0] || "",
          price: product.price || 0,
        };
      }),
    [cartItems, products]
  );

  // Calculate totals
  const subtotal = enrichedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleContinue = () => {
    onClose();
    dispatch(clearOrderState());
    dispatch(clearCart());
    navigate("/checkout");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-scaleIn">
        {/* Close button */}
        <button
          onClick={handleContinue}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition text-lg font-bold"
        >
          ×
        </button>

        <FaCheckCircle className="mx-auto text-primary text-6xl mb-4" />

        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          {successMessage || "Order Placed Successfully!"}
        </h2>

        {/* Order Items */}
        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Products</h3>
          <div className="max-h-56 overflow-y-auto space-y-3">
            {enrichedItems.length > 0 ? (
              enrichedItems.map((item) => (
                <div
                  key={item.cartItemId || item.productId}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No items found</p>
            )}
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

        <button
          onClick={handleContinue}
          className="bg-primary text-white py-3 px-6 w-full rounded-lg font-medium hover:bg-primary/90 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OrderPopup;
