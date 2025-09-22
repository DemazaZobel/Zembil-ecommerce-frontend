// src/pages/checkout/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderPopup from "../../components/order/OrderPopup";
import { fetchCart } from "../../features/cart/cartSlice";
import { getShippingAddresses, addShippingAddress } from "../../features/shipping/shipmentSlice";
import { fetchZones } from "../../features/delivery/deliverySlice";

const Checkout = () => {
  const dispatch = useDispatch();

  // Redux state
  const { items: cartItems } = useSelector((state) => state.cart);
  const { addresses: shippingAddresses, loading: shippingLoading } = useSelector(
    (state) => state.shipping
  );
  const { info: user } = useSelector((state) => state.user);
  const { zones } = useSelector((state) => state.delivery);

  // Billing form
  const [billing, setBilling] = useState({
    fullName: user?.name || "",
    houseNumber: "",
    street: "",
    area: "",
    specificTown: "",
    city: "",
    country: "Ethiopia",
    postalCode: "",
    phoneNumber: user?.phone || "",
    zoneId: "",
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [popupVisible, setPopupVisible] = useState(false);
  const [orderNumber, setOrderNumber] = useState("12345ABC");

  // Load cart, shipping addresses & zones
  useEffect(() => {
    dispatch(fetchCart());
    dispatch(getShippingAddresses());
    dispatch(fetchZones());
  }, [dispatch]);

  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

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
        {/* Shipping & Payment */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Shipping & Billing Details
          </h2>

          {/* Saved Addresses */}
          {shippingLoading ? (
            <p>Loading addresses...</p>
          ) : (
            <div className="space-y-3 mb-6">
              {shippingAddresses.length === 0 && <p>No saved addresses.</p>}
              {shippingAddresses.map((addr) => (
                <div key={addr.id}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={addr.id}
                      checked={selectedAddress?.id === addr.id}
                      onChange={() => {
                        setSelectedAddress(addr);
                        setBilling({
                          ...billing,
                          fullName: addr.fullName,
                          houseNumber: addr.houseNumber || "",
                          street: addr.street,
                          area: addr.area,
                          specificTown: addr.specificTown || "",
                          city: addr.city,
                          country: "Ethiopia",
                          postalCode: addr.postalCode || "",
                          phoneNumber: addr.phoneNumber,
                          zoneId: addr.zoneId || "",
                        });
                      }}
                      className="accent-primary"
                    />
                    <span>
                      {addr.fullName}, {addr.houseNumber && `House ${addr.houseNumber},`}{" "}
                      {addr.street}, {addr.area}, {addr.specificTown && `${addr.specificTown},`}{" "}
                      {addr.city}, Ethiopia
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Billing Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={billing.fullName}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="houseNumber"
              placeholder="House Number"
              value={billing.houseNumber}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={billing.street}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="area"
              placeholder="Area"
              value={billing.area}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="specificTown"
              placeholder="Specific Town"
              value={billing.specificTown}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
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
              name="country"
              placeholder="Country"
              value={billing.country}
              readOnly
              className="border px-4 py-3 rounded-lg w-full bg-gray-100 cursor-not-allowed"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={billing.postalCode}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={billing.phoneNumber}
              onChange={handleChange}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Delivery Zone */}
          <div className="mb-4">
            <select
              value={billing.zoneId}
              onChange={(e) =>
                setBilling({ ...billing, zoneId: e.target.value })
              }
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Zone/Area</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} {z.areas ? `(${z.areas})` : ""}
                </option>
              ))}
            </select>
            {!billing.zoneId && (
              <p className="text-sm text-gray-600 mt-1">
                If your location isn’t listed, choose the nearest/closest location for pickup or provide postal code.
              </p>
            )}
          </div>

          {/* Save Address */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                if (!billing.fullName || !billing.street || !billing.city) {
                  alert("Please fill Full Name, Street, and City to save address.");
                  return;
                }
                dispatch(
                  addShippingAddress({
                    ...billing,
                    userId: user?.id, // Add the currently logged-in user ID
                  })
                );

                alert("Address saved successfully!");
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save Address
            </button>
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
                key={item.cartItemId}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">
                  {item.name} x{item.quantity}
                </span>
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
              disabled={!billing.fullName || cartItems.length === 0}
              className={`mt-6 block w-full text-center py-3 rounded-lg font-medium shadow transition ${
                !billing.fullName || cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
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
