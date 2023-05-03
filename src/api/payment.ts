import { fetchApi } from "./utils";

export enum PaymentStatus {
  ORDERED = "ORDERED",
  PENDING = "PENDING",
  PAID = "PAID",
}

type BasePayment = {
  _id: string;
  order: string;
  clientSecret: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
};

export type CreatePaymentParams = { paymentId: string };
export const createPayment = async ({ paymentId }: CreatePaymentParams) => {
  const { data } = await fetchApi<BasePayment>(
    `/payments/${paymentId}/initialize-payment`,
    {
      method: "PATCH",
    }
  );

  return data;
};

export const getPaymentConfig = async () => {
  const { data } = await fetchApi<{ publishableKey: string }>(
    `/payments/config`,
    {
      method: "GET",
    }
  );

  return data;
};

export const getPayments = async () => {
  const { data } = await fetchApi<BasePayment[]>(`/payments`, {
    method: "GET",
  });

  return data;
};

type GetPaymentParams = { paymentId: string };
export const getPayment = async ({ paymentId }: GetPaymentParams) => {
  const { data } = await fetchApi<BasePayment>(`/payments/${paymentId}`, {
    method: "GET",
  });

  return data;
};
