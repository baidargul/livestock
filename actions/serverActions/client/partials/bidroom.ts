import axios from "axios";
import { RoomType } from "../../server/partials/bidroom";

async function list(value: string, key: "id" | "key") {
  const response = await axios.get(`/api/rooms?${key}=${value}&key=${key}`);
  return response;
}
async function createBidRoom(room: RoomType) {
  const response = await axios.post("/api/rooms", room);
  return response;
}
async function closeBidRoom(value: string, key: "id" | "key") {
  const response = await axios.delete(`/api/rooms?id=${value}&key=${key}`);
  return response;
}
async function listByUser(userId: string, animalId?: string) {
  const response = await axios.get(
    `/api/rooms/my?userId=${userId}&animalId=${animalId ?? undefined}`
  );
  return response.data;
}
export const bidRoom = {
  list,
  listByUser,
  createBidRoom,
  closeBidRoom,
};
