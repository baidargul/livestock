import axios from "axios";
const apiPath = "/api/user";

async function signup(name: string, email: string, password: string) {
  if (!name || !email || !password) return null;
  const data = {
    name,
    email,
    password,
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

export const user = {
  signin,
  signup,
};
