import axios from "axios";

async function onAnimal(animalId: string) {
  const response = await axios.get(`/api/bidding?animalId=${animalId}`);
  return response.data;
}

export const bidding = {
  onAnimal,
};
