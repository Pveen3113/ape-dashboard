import { PlantingStage } from "@/vars/roles";
import { fetchApi } from "./utils";

export type BaseOrder = {
  _id: string;
  user: string;
  approved: boolean;
  plants: { species: string; quantity: number }[];
  greetings: string;
  plantingStage: PlantingStage;
  payment: string;
};

export type CreateOrderParams = {
  greetings: string;
  plants: { species: string; quantity: number }[];
};

export const createOrder = async (orderDetails: CreateOrderParams) => {
  const { data } = await fetchApi<BaseOrder>("/orders", {
    method: "POST",
    data: { ...orderDetails },
  });

  return data;
};

export const getOrders = async () => {
  const { data } = await fetchApi<BaseOrder[]>("/orders", {
    method: "GET",
  });

  return data;
};

export const getOrdersByMe = async () => {
  const { data } = await fetchApi<BaseOrder[]>("/orders/me", {
    method: "GET",
  });

  return data;
};

export type ApproveOrderParams = {
  orderId: string;
};
export const approveOrder = async ({ orderId }: ApproveOrderParams) => {
  const { data } = await fetchApi<string>(`/orders/${orderId}/approve`, {
    method: "PATCH",
  });
  return data;
};

export type UpdateOrderStageParams = {
  orderId: string;
  plantingStage: PlantingStage;
};
export const updateStage = async ({
  orderId,
  plantingStage,
}: UpdateOrderStageParams) => {
  const { data } = await fetchApi<string>(`/orders/${orderId}/setStage`, {
    method: "PATCH",
    data: { plantingStage },
  });
  return data;
};

export type UpdateCoordinates = {
  orderId: string;
  coordinates: string;
};

export const updateCoordinates = async ({
  orderId,
  coordinates,
}: UpdateCoordinates) => {
  const { data } = await fetchApi<string>(
    `/orders/${orderId}/updateCoordinates`,
    {
      method: "PATCH",
      data: { coordinates },
    }
  );
  return data;
};
