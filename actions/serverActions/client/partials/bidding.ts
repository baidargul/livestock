import axios from "axios";

async function inRoom(id: string) {
  const response = await axios.get(`/api/bidding?id=${id}`);
  return response.data;
}

export const bidding = {
  inRoom,
};
