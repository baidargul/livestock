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
async function getSellingOrders(userId: string, page: number, limit: number) {
  const response = await axios.get(
    `/api/orders/selling?userId=${userId}&page=${page}&limit=${limit}`
  );
  return response.data;
}

async function withdraw(userId: string, orderId: string) {
  const response = await axios.get(
    `/api/orders/withdraw?userId=${userId}&orderId=${orderId}`
  );
  return response.data;
}

async function getOrderPreview(orderId: string) {
  const response = await axios.get(`/api/orders/preview?orderId=${orderId}`);
  return response.data;
}

async function create(order: any) {
  const data = { order };
  const response = await axios.post(`/api/orders`, order);
  return response.data;
}

export const orders = {
  create,
  withdraw,
  getOrderPreview,
  getOrderCount,
  getPurchaseOrders,
  getSellingOrders,
};
