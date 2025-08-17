import axios from "axios";

async function getOrderCount(userId: string) {
  const response = await axios.get(`/api/orders/count?userId=${userId}`);
  return response.data;
}

async function getPurchaseOrders(userId: string, page: number, limit: number) {
  const response = await axios.get(
    `/api/orders/buying?userId=${userId}&page=${page}&limit=${limit}`
  );
  return response.data;
}

async function withdraw(userId: string, orderId: string) {
  const response = await axios.get(
    `/api/orders/withdraw?userId=${userId}&orderId=${orderId}`
  );
  return response.data;
}

export const orders = {
  withdraw,
  getOrderCount,
  getPurchaseOrders,
};
