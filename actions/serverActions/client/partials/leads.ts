import axios from "axios";

const apiPath = "/api/leads";

async function forAnimal(animalId: string) {
  if (!animalId) return null;
  const response: any = await axios.get(
    `${apiPath}/forAnimal?animalId=${animalId}`
  );
  return response.data;
}
async function hasLead(animalId: string, userId: string) {
  if (!animalId || !userId) return null;
  const response: any = await axios.get(
    `${apiPath}/hasLead?animalId=${animalId}&userId=${userId}`
  );
  return response.data;
}

async function create(animalId: string, userId: string) {
  if (!animalId || !userId) return null;
  const data = { animalId, userId };
  const response = await axios.post(`${apiPath}`, data);
  return response.data;
}

async function remove(leadId: string) {
  if (!leadId) return null;
  const response = await axios.delete(`${apiPath}?leadId=${leadId}`);
  return response.data;
}

async function listAll() {
  const response = await axios.get(apiPath);
  return response.data;
}

export const leads = {
  listAll,
  create,
  forAnimal,
  hasLead,
  remove,
};
