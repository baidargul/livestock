import prisma from "@/lib/prisma";
import { actions } from "../../actions";
import { Animal } from "@prisma/client";
async function listAll(value?: string, key?: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    let all: any;
    if (value && key) {
      all = await prisma.animal.findMany({
        where: {
          [key]: value,
        },
        include: {
          user: {
            omit: {
              password: true,
              email: true,
            },
          },
        },
      });
    } else {
      all = await prisma.animal.findMany({
        include: {
          user: {
            omit: {
              password: true,
              email: true,
            },
          },
        },
      });
    }

    let animals: any = [];
    for (const animal of all) {
      // const images = await actions.server.images.fetchImages(animal.images);
      const images = animal?.images.map((img: any) => {
        return {
          name: img.Key,
          image: `https://pub-2af91482241043e491600e0712bb4806.r2.dev/${img.Key}`,
        };
      });
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
      include: {
        user: {
          omit: {
            password: true,
            email: true,
          },
        },
      },
    });

    if (!target) {
      response.status = 400;
      response.message = `Animal not found`;
      response.data = null;
      return response;
    }

    const images = await actions.server.images.fetchImages(target.images);
    const animal = { ...target, images };

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
