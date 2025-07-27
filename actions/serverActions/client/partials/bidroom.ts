import axios from "axios";
import { RoomType } from "../../server/partials/bidroom";
import { bidding } from "./bidding";

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
async function listByUser(userId: string, animalId?: any, limit: number = 5) {
  const response = await axios.get(
    `/api/rooms/my?userId=${userId}&animalId=${animalId}&limit=${limit}`
  );
  return response.data;
}

async function lockBidAsFinalOffer(roomId: string, userId: string) {
  const data = {
    roomId,
    userId,
  };
  const response = await axios.post(`/api/rooms/bid/lock`, data);
  return response.data;
}
async function GetCustomerContact(activeBidRoomId: string, userId: string) {
  const response = await axios.get(
    `/api/rooms/cto?activeBidRoomId=${activeBidRoomId}&userId=${userId}`
  );
  return response.data;
}

export const bidRoom = {
  list,
  listByUser,
  createBidRoom,
  closeBidRoom,
  lockBidAsFinalOffer,
  GetCustomerContact,
  bidding,
};
