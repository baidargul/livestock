import { InteractionType } from "@prisma/client";

const InteractionWeights = {
  VIEW: 1,
  LIKE: 5,
  BID: 10,
  FOLLOW_SELLER: 20,
  SAVE: 3,
};

async function saveInteraction(
  userId: string,
  animalId: string,
  type: InteractionType
) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    const weight = InteractionWeights[type] || 0;

    const interaction = await prisma?.interaction.create({
      data: {
        userId,
        animalId,
        type,
        weight,
      },
    });

    response.status = 200;
    response.message = "Interaction saved successfully";
    response.data = interaction ?? null;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const interactions = {
  saveInteraction,
};
