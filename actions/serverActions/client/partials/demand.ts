import axios from "axios";

async function createDemand(data: any) {
  const response = await axios.post(`/api/demand`, data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
}

async function list(id: string) {}

async function listAll() {
  const response = await axios.get(`/api/demand`);
  return response.data;
}

export const demand = {
  list,
  listAll,
  createDemand,
};
