import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../features/cart/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white/70 rounded-xl shadow-lg">
          <p className="text-lg text-gray-600 mb-4">
            🛒 Your cart is currently empty
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow hover:bg-primary/90 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${index}`}
                className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow-md hover:shadow-lg transition p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 rounded-lg object-cover"
                />

                <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h2>
                      {item.size && (
                        <p className="text-sm text-gray-500">
                          Size: <span className="font-medium">{item.size}</span>
                        </p>
                      )}
                      <p className="text-gray-500">${item.price.toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() =>
                        dispatch(removeFromCart({ id: item.id, size: item.size }))
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center mt-4">
                    <button
                      onClick={() =>
                        dispatch(decreaseQuantity({ id: item.id, size: item.size }))
                      }
                      className="p-2 rounded-l-lg bg-gray-200 hover:bg-gray-300 transition"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="px-5 py-2 bg-gray-100 font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(increaseQuantity({ id: item.id, size: item.size }))
                      }
                      className="p-2 rounded-r-lg bg-gray-200 hover:bg-gray-300 transition"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 text-right w-full sm:w-32">
                  <p className="font-semibold text-lg text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Order Summary
            </h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-secondary">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>${(totalPrice * 1.1).toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-6 block w-full text-center bg-primary text-white py-3 rounded-lg font-medium shadow hover:bg-primary/90 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

