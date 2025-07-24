import axios from "axios";
import { ProtocolType } from "../../actions";

const apiPath = "/api/server/protocol/";

const list = async (name: string) => {
  const response = await axios.get(`${apiPath}?name=${name}`);
  return response.data;
};

const listAll = async () => {
  const response = await axios.get(apiPath);
  return response.data;
};

const create = async (protocol: ProtocolType) => {
  const response = await axios.post(apiPath, protocol);
  return response.data;
};

export const BusinessProtocols = {
  list,
  listAll,
  create,
};
