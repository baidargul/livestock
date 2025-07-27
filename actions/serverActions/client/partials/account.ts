import axios from "axios";

const apiPath = "/api/user/account";

async function getBalance(userId: string) {
  const response = await axios.get(`${apiPath}?userId=${userId}`);
  return response.data;
}

async function recharge(userId: string, amount: number) {
  const response = await axios.get(
    `${apiPath}/recharge?userId=${userId}&amount=${amount}`
  );
  return response.data;
}

export const account = {
  recharge,
  getBalance,
};
