import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, getAllUsers, addProduct } from "../api/adminApi";
import { useDispatch } from "react-redux";
import { setOrders, setUsers, setProducts } from "../features/adminSlice";

export const useAdmin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Fetch all orders
  const ordersQuery = useQuery(["adminOrders"], getAllOrders, {
    onSuccess: (data) => dispatch(setOrders(data)),
  });

  // Fetch all users
  const usersQuery = useQuery(["adminUsers"], getAllUsers, {
    onSuccess: (data) => dispatch(setUsers(data)),
  });

  // Add product
  const createProduct = useMutation(addProduct, {
    onSuccess: () => queryClient.invalidateQueries(["adminProducts"]),
  });

  return { ordersQuery, usersQuery, createProduct };
};