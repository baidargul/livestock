import axios from "axios";
import { account } from "./account";
import { contacts } from "./contacts";
import { interactions } from "../../server/partials/interactions";
const apiPath = "/api/user";

async function signup(
  name: string,
  email: string,
  password: string,
  province?: string,
  city?: string,
  phone?: string
) {
  if (!name || !email || !password) return null;
  const data = {
    name,
    email,
    password,
    province,
    city,
    phone,
  };
  const response = await axios.post(apiPath + "/signup", data);
  return response.data;
}

async function signin(email: string, password: string) {
  if (!email || !password) return null;
  const data = {
    email,
    password,
  };
  const response = await axios.post(apiPath + "/signin", data);
  return response.data;
}

async function signout(session: any) {
  const response = await axios.post(apiPath + "/signout", session);
  return response.data;
}

async function followUser(targetUserId: string, currentUserId: string) {
  if (!targetUserId || !currentUserId) return null;
  const data = {
    targetUserId,
    currentUserId,
  };
  const response = await axios.post(apiPath + "/follow", data);
  return response.data;
}
async function isFollowing(targetUserId: string, currentUserId: string) {
  if (!targetUserId || !currentUserId) return null;
  const data = {
    targetUserId,
    currentUserId,
  };
  const response = await axios.post(apiPath + "/follow/isFollowing", data);
  return response.data;
}
async function setProfileImage(userId: string, image: any) {
  if (!image) return null;
  const data = {
    userId,
    image,
  };
  const response = await axios.post(apiPath + "/profileImage", data);
  return response.data;
}
async function setCoverImage(userId: string, image: any) {
  if (!image) return null;
  const data = {
    userId,
    image,
  };
  const response = await axios.post(apiPath + "/coverImage", data);
  return response.data;
}

export const user = {
  signin,
  signup,
  signout,
  isFollowing,
  followUser,
  setProfileImage,
  setCoverImage,
  account,
  contacts,
  interactions,
};
