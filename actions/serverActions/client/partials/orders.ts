import axios from "axios";

async function getOrderCount(userId: string) {
  const response = await axios.get(`/api/orders/count?userId=${userId}`);
  return response.data;
}

export const orders = {
  getOrderCount,
};
