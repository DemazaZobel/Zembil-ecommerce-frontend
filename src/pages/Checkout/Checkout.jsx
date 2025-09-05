import React, { useState } from "react";
import { Link } from "react-router-dom";
import OrderPopup from "../../components/order/OrderPopup";



const Checkout = () => {
  const [billing, setBilling] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [popupVisible, setPopupVisible] = useState(false);
 const [orderNumber, setOrderNumber] = useState("12345ABC");

  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  // Example cart summary (replace with real cart data)
  const cartItems = [
    { id: 1, name: "Classic White Shirt", price: 29.99, quantity: 2 },
    { id: 2, name: "Denim Jeans", price: 49.99, quantity: 1 },
  ];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        🛒 Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Billing Details */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Billing Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={billing.fullName}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={billing.email}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={billing.phone}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={billing.address}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={billing.city}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={billing.state}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP"
              value={billing.zip}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={billing.country}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3 text-gray-800">
              Payment Method
            </h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="creditCard"
                  checked={paymentMethod === "creditCard"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-primary"
                />
                Credit/Debit Card
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-primary"
                />
                PayPal
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-primary"
                />
                Cash on Delivery
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Order Summary
          </h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">{item.name} x{item.quantity}</span>
                <span className="font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="flex justify-between font-semibold text-gray-900">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax</span>
              <span>${(subtotal * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>${(subtotal * 1.1).toFixed(2)}</span>
            </div>

            <button
            onClick={() => setPopupVisible(true)}
            className="mt-6 block w-full text-center bg-primary text-white py-3 rounded-lg font-medium shadow hover:bg-primary/90 transition"
          >
            Place Order
          </button>
          <OrderPopup
            visible={popupVisible}
            onClose={() => setPopupVisible(false)}
            orderNumber={orderNumber}
          />


          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
