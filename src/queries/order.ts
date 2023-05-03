import { getOrders, getOrdersByMe } from "@/api/order";
import { getPayment, getPaymentConfig, getPayments } from "@/api/payment";
import { useQuery } from "@tanstack/react-query";

export const usePayments = (enableQuery = true) => {
  return useQuery(["payments"], getPayments, {
    enabled: enableQuery,
  });
};

export const usePayment = (paymentId: string) => {
  return useQuery(["payment", { paymentId }], () => getPayment({ paymentId }));
};

export const useStripePublishableKey = () => {
  return useQuery(["publishable_key"], getPaymentConfig);
};

export const useMyOrders = () => {
    return useQuery(["my-orders"], getOrdersByMe)
}

export const useOrders = () => {
    return useQuery(["orders"], getOrders)
}