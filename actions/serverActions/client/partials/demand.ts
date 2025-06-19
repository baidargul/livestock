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

export const demand = {
  createDemand,
};
