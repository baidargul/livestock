import axios from "axios";
const apiPath = "/api/user/contacts";
async function listAll(userId: string) {
  const response = await axios.get(`${apiPath}?userId=${userId}`);
  return response.data;
}

async function deleteContact(contactId: string) {
  const response = await axios.delete(`${apiPath}?contactId=${contactId}`);
  return response.data;
}

async function createContact(
  authorId: string,
  userId: string,
  remarks?: string
) {
  const response = await axios.post(
    `${apiPath}?authorId=${authorId}&userId=${userId}&remarks=${remarks}`
  );
  return response.data;
}

async function toggleFavorite(contactId: string) {
  const response = await axios.patch(`${apiPath}?contactId=${contactId}`);
  return response.data;
}

export const contacts = {
  listAll,
  toggleFavorite,
  deleteContact,
  createContact,
};
