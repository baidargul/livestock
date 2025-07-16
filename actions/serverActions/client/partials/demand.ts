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
async function list(id: string) {
  const response = await axios.get(`/api/demand?id=${id}`, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
}
async function listAll(where?: any) {
  const response = await axios.get(`/api/demand?where=${where}`);
  return response.data;
}
async function removeDemand(id: string) {
  const response = await axios.delete(`/api/demand?id=${id}`, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
}
async function hasUserPostedOffer(userId: string, demandId: string) {
  const response = await axios.get(
    `/api/demand/hasUserPostedOffer?userId=${userId}&demandId=${demandId}`,
    {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
  return response.data;
}

export const demand = {
  list,
  listAll,
  createDemand,
  removeDemand,
  hasUserPostedOffer,
};
