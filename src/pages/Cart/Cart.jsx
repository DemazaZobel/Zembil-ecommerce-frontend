// src/components/cart/Cart.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../features/cart/cartSlice.js";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems, status, error } = useSelector((state) => state.cart);

  // Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Total price calculation
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.productDetail?.price || 0);
    return total + price * item.quantity;
  }, 0);

  if (status === "loading") return <p className="text-center text-lg">Loading cart...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const handleCheckout = () => navigate("/checkout");

  // Helper to refresh cart after an action
  const handleAction = (action) => {
    dispatch(action).then(() => dispatch(fetchCart()));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🛒 Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 text-gray-500 border rounded-lg shadow-sm bg-gray-50">
          <p className="text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const price = Number(item.productDetail?.price || 0);
              const name = item.productDetail?.name || "Unknown Product";
              const image = item.productDetail?.images?.[0] || "/placeholder.png";

              return (
                <div
                  key={`${item.id}-${item.sizeId}`} // unique key
                  className="flex items-center gap-6 border p-4 rounded-2xl shadow hover:shadow-md transition bg-white"
                >
                  {/* Product Image */}
                  <img
                    src={`http://localhost:5000/${image}`}
                    alt={name}
                    className="w-28 h-28 object-cover rounded-xl border"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-gray-800">{name}</p>
                    <p className="text-gray-500 text-sm mb-1">
                      Size: {item.sizeDetail?.name || "N/A"}
                    </p>
                    <p className="text-blue-600 font-semibold">${price.toFixed(2)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleAction(decreaseQuantity({ id: item.id, quantity: item.quantity - 1 }))
                        }
                        disabled={item.quantity === 1}
                        className={`p-2 bg-gray-100 hover:bg-gray-200 transition ${
                          item.quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="px-4 font-medium">{item.quantity}</span>

                      <button
                        onClick={() =>
                          handleAction(increaseQuantity({ id: item.id, quantity: item.quantity + 1 }))
                        }
                        className="p-2 bg-gray-100 hover:bg-gray-200 transition"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    {/* Remove Item */}
                    <button
                      onClick={() => handleAction(removeFromCart(item.id))}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="border rounded-2xl shadow p-6 bg-white h-fit sticky top-6 min-w-70">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-4">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className={`mt-6 w-full py-3 rounded-xl text-white font-semibold transition ${
                cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
