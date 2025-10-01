import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderPopup from "../../components/order/OrderPopup";
import MessageBox from "../../components/common/MessageBox"; 
import { fetchCart } from "../../features/cart/cartSlice";
import { getShippingAddresses, addShippingAddress } from "../../features/shipping/shipmentSlice";
import { fetchZones } from "../../features/delivery/deliverySlice";
import { placeOrder } from "../../features/order/orderSlice";
import { fetchProducts } from "../../features/product/productSlice";

const Checkout = () => {
  const dispatch = useDispatch();

  const { items: cartItems } = useSelector((state) => state.cart);
  const { addresses: shippingAddresses, loading: shippingLoading } = useSelector((state) => state.shipping);
  const { info: user } = useSelector((state) => state.user);
  const { zones } = useSelector((state) => state.delivery);

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
    zoneId: localStorage.getItem("selectedZoneId") || "",
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [popupVisible, setPopupVisible] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCart());
    dispatch(getShippingAddresses());
    dispatch(fetchZones());
  }, [dispatch]);

  // Pre-fill billing from previous address
  useEffect(() => {
    if (shippingAddresses.length > 0) {
      const myAddress = shippingAddresses.find(addr => addr.userId === user?.id);
      if (myAddress) {
        setSelectedAddress(myAddress);
        setBilling({
          fullName: myAddress.fullName,
          houseNumber: myAddress.houseNumber || "",
          street: myAddress.street,
          area: myAddress.area,
          specificTown: myAddress.specificTown || "",
          city: myAddress.city,
          country: "Ethiopia",
          postalCode: myAddress.postalCode || "",
          phoneNumber: myAddress.phoneNumber,
          zoneId: myAddress.zoneId || localStorage.getItem("selectedZoneId") || "",
        });
      }
    }
  }, [shippingAddresses, user]);

  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const userAddresses = shippingAddresses.filter(addr => addr.userId === user?.id);
  const canPlaceOrder = selectedAddress && billing.fullName && billing.street && billing.city;

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) {
      setMessage("⚠️ Please select or save a shipping address before placing your order.");
      setMessageType("error");
      return;
    }
    if (cartItems.length === 0) {
      setMessage("⚠️ Your cart is empty.");
      setMessageType("error");
      return;
    }

    try {
      const resultAction = await dispatch(
        placeOrder({
          cartItems,
          shippingAddressId: selectedAddress.id,
          paymentMethod,
          zoneId: Number(billing.zoneId),
        })
      ).unwrap();

      setOrderNumber(resultAction.id || "12345ABC");
      setPopupVisible(true);
      setMessage("✅ Order placed successfully!");
      setMessageType("success");
    } catch (err) {
      setMessage("❌ Failed to place order: " + err);
      setMessageType("error");
    }
  };

  const handleSaveAddress = () => {
    if (!billing.fullName || !billing.street || !billing.city) {
      setMessage("⚠️ Please fill Full Name, Street, and City to save address.");
      setMessageType("error");
      return;
    }

    dispatch(addShippingAddress({ ...billing, userId: user?.id }));

    const savedAddress = {
      ...billing,
      id: selectedAddress?.id || Date.now(),
    };
    setSelectedAddress(savedAddress);

    // Save zoneId to localStorage
    localStorage.setItem("selectedZoneId", billing.zoneId);

    setMessage("✅ Address saved successfully!");
    setMessageType("success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {message && (
        <div className="mb-4">
          <MessageBox type={messageType} message={message} onClose={() => setMessage(null)} />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">🛒 Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Shipping & Payment */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Shipping & Billing Details</h2>

          {shippingLoading ? (
            <p>Loading addresses...</p>
          ) : (
            <>
              {userAddresses.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {userAddresses.map((addr) => (
                    <div key={addr.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{addr.fullName}</p>
                        <p className="text-gray-700 text-sm">
                          {addr.houseNumber && `House ${addr.houseNumber}, `}
                          {addr.street}, {addr.area}, {addr.specificTown && `${addr.specificTown}, `}
                          {addr.city}, Ethiopia
                        </p>
                        <p className="text-gray-700 text-sm">Phone: {addr.phoneNumber}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          className={`px-3 py-1 rounded-lg text-white ${
                            selectedAddress?.id === addr.id ? "bg-green-600" : "bg-primary"
                          }`}
                          onClick={() => {
                            setSelectedAddress(addr);
                            setBilling({
                              fullName: addr.fullName,
                              houseNumber: addr.houseNumber || "",
                              street: addr.street,
                              area: addr.area,
                              specificTown: addr.specificTown || "",
                              city: addr.city,
                              country: "Ethiopia",
                              postalCode: addr.postalCode || "",
                              phoneNumber: addr.phoneNumber,
                              zoneId: addr.zoneId || localStorage.getItem("selectedZoneId") || "",
                            });
                          }}
                        >
                          {selectedAddress?.id === addr.id ? "Selected" : "Select"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mb-4">No saved addresses. Please fill the form below.</p>
              )}
            </>
          )}

          {/* Billing Form */}
          <div id="billing-form" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {["fullName", "houseNumber", "street", "area", "specificTown", "city", "postalCode", "phoneNumber"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  value={billing[field]}
                  onChange={handleChange}
                  className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              )
            )}
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={billing.country}
              readOnly
              className="border px-4 py-3 rounded-lg w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Delivery Zone */}
          <div className="mb-4">
            <select
              value={billing.zoneId}
              onChange={(e) => setBilling({ ...billing, zoneId: e.target.value })}
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
              onClick={handleSaveAddress}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save Address
            </button>
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3 text-gray-800">Payment Method</h3>
            <div className="flex flex-col gap-3">
              {["creditCard", "paypal", "cod"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-primary"
                  />
                  {method === "creditCard" ? "Credit/Debit Card" : method === "paypal" ? "PayPal" : "Cash on Delivery"}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-700">{item.name} x{item.quantity}</span>
                <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="flex justify-between font-semibold text-gray-900">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-secondary"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between text-gray-600"><span>Estimated Tax</span><span>${(subtotal * 0.1).toFixed(2)}</span></div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900"><span>Total</span><span>${(subtotal * 1.1).toFixed(2)}</span></div>

            <button
              onClick={handlePlaceOrder}
              className={`mt-6 block w-full text-center py-3 rounded-lg font-medium shadow transition ${
                !canPlaceOrder || cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              Place Order
            </button>

            {!canPlaceOrder && (
              <p className="text-sm text-red-500 mt-1">
                Please select or save a shipping address before placing your order.
              </p>
            )}

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
