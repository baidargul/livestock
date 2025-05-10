import prisma from "@/lib/prisma";
import { actions } from "../../actions";
import { Animal } from "@prisma/client";
async function listAll() {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    const all = await prisma.animal.findMany();
    let animals = [];
    // for (const animal of all) {
    //   const images = await actions.server.images.fetchImages(animal.images);
    //   animals.push({ ...animal, images });
    // }
    animals = all;

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
async function list(val: any, key: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    const whereClause = {
      [key]: val,
    };
    const target: any = await prisma.animal.findFirst({
      where: { ...whereClause },
    });

    if (!target) {
      response.status = 400;
      response.message = `Animal not found`;
      response.data = null;
      return response;
    }

    // const images = await actions.server.images.fetchImages(target.images);
    // const animal = { ...target, images };
    const animal = target;

    response.status = 200;
    response.message = "Animal fetched successfully";
    response.data = animal;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR]: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

async function removePost(id: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const images = await prisma.animal.findFirst({
      where: { id },
      select: {
        images: true,
      },
    });
    const deletedImages = await actions.server.images.deleteImages(
      images?.images as any
    );

    const deletedPost = await prisma.animal.delete({
      where: { id },
    });

    response.status = 200;
    response.message = "Post deleted successfully";
    response.data = deletedPost;
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
  list,
  listAll,
  removePost,
};
