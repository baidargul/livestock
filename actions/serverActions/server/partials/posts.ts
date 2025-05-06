import prisma from "@/lib/prisma";
import { actions } from "../../actions";
async function listAll() {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    const all = await prisma.animal.findMany();
    let animals = [];
    for (const animal of all) {
      const images = await actions.server.images.fetchImages(animal.images);
      animals.push({ ...animal, images });
    }

    response.status = 200;
    response.message = "Posts fetched successfully";
    response.data = animals;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR]: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const post = {
  listAll,
};
