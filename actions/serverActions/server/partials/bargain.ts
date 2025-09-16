import prisma from "@/lib/prisma";
import { actions } from "../../actions";

async function ListCurrentAnimalsInBargaining(userId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const [user, myrooms, otherrooms] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
      prisma.bidRoom.findMany({
        where: {
          authorId: userId,
        },
        include: {
          animal: true,
          bids: true,
        },
      }),
      prisma.bidRoom.findMany({
        where: {
          userId: userId,
        },
        include: {
          animal: true,
          bids: true,
        },
      }),
    ]);

    if (!user) {
      response.status = 404;
      response.message = "User not found";
      response.data = null;
      return response;
    }

    const rooms = [...myrooms, ...otherrooms];
    const imageBucket: { roomKey: string; images: [] }[] = [];
    let processedRooms = [];
    for (const room of rooms) {
      if (room.animal) {
        let images: any = room.animal?.images;
        if (images) {
          if (room.key) {
            imageBucket.push({ roomKey: room.key, images: images });
          }
        }
      }
    }

    // Collect all keys in one go
    const allAnimalImages = imageBucket.flatMap((a) => a?.images || []);

    // Fetch all images in parallel
    const [animalImagesFetched] = await Promise.all([
      actions.server.images.fetchImages(allAnimalImages),
    ]);

    // Map back images to each animal
    const animals = imageBucket.map((animal: any) => ({
      ...animal,
      images: animalImagesFetched.filter((img: any) =>
        (animal?.images || []).some((orig: any) => orig.Key === img.name)
      ),
    }));

    response.status = 200;
    response.message = "Success";
    response.data = { animals: animals };
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const bargain = {
  ListCurrentAnimalsInBargaining,
};
