// src/hooks/useDelivery.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyOrders, updateOrderStatus } from "../api/deliveryApi";
import { useDispatch } from "react-redux";
import { setMyOrders } from "../features/deliverySlice";

export const useDelivery = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // ✅ Correct v5 syntax
  const ordersQuery = useQuery({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
    onSuccess: (data) => dispatch(setMyOrders(data)),
  });

  const changeStatus = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["myOrders"] }),
  });

  return { ordersQuery, changeStatus };
};