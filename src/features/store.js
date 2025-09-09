import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import cartReducer from "./cart/cartSlice";
import productReducer from "./product/productSlice";
import categoryReducer from "./category/categorySlice"; 

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer, 
  },
});
