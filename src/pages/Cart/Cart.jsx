import React, { useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import img1 from "../../assets/dress.jpg"; 
import img2 from "../../assets/jeans.jpg"; 

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Classic White Shirt",
      price: 29.99,
      quantity: 2,
      size: "M",
      image: img1,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 2,
      name: "Denim Jeans",
      price: 49.99,
      quantity: 1,
      size: "L",
      image: img2,
      sizes: ["S", "M", "L", "XL"],
    },
  ]);

  const increaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleSizeChange = (id, newSize) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, size: newSize } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
            {cartItems.map((item) => (
              <div
                key={item.id}
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
                      <p className="text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Size Selection */}
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-gray-500 text-sm">Size:</span>
                    {item.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(item.id, size)}
                        className={`px-3 py-1 border rounded-full text-sm transition ${
                          item.size === size
                            ? "bg-primary text-white border-primary"
                            : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center mt-4">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-2 rounded-l-lg bg-gray-200 hover:bg-gray-300 transition"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="px-5 py-2 bg-gray-100 font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
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
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-secondary">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>${(subtotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>${(subtotal * 1.1).toFixed(2)}</span>
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
