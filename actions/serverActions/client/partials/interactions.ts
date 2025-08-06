import { InteractionType } from "@prisma/client";
import axios from "axios";

async function saveInteraction(
  userId: string,
  animalId: string,
  type: InteractionType
) {
  const response = await axios.post(
    `/api/user/interactions?userId=${userId}&animalId=${animalId}&type=${type}`
  );
  return response.data;
}

export const interactions = {
  saveInteraction,
};
