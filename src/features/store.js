import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import cartReducer from "./cart/cartSlice";
import productReducer from "./product/productSlice";
import categoryReducer from "./category/categorySlice"; 
import shipmentReducer from "./shipping/shipmentSlice";
import deliveryReducer from "./delivery/deliverySlice";
import reviewReducer from "./Review/reviewSlice";
import orderReducer from "./order/orderSlice"; // ✅ import order reducer

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer, 
    shipping: shipmentReducer,
    delivery: deliveryReducer,
    review: reviewReducer,
    order: orderReducer, // ✅ add order reducer

  },
});
