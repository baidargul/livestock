import axios from "axios";

const apiPath = "/api/user/account";

async function getBalance(userId: string) {
  const response = await axios.get(`${apiPath}?userId=${userId}`);
  return response.data;
}

export const account = {
  getBalance,
};
