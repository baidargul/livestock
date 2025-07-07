import prisma from "@/lib/prisma";
async function onAnimal(id: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const animal = await prisma.animal.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
            id: true,
          },
        },
        BidRoom: {
          include: {
            bids: {
              include: {
                BidRoom: {
                  select: {
                    id: true,
                    offer: true,
                    maleQuantityAvailable: true,
                    femaleQuantityAvailable: true,
                  },
                },
                user: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
              orderBy: [{ createdAt: "desc" }, { price: "desc" }],
            },
          },
        },
      },
    });

    if (!animal) {
      response.status = 400;
      response.message = `Animal not found`;
      response.data = null;
      return response;
    }

    let bids: any = [];
    for (const room of animal.BidRoom) {
      bids = [...bids, ...room.bids];
    }

    //sort bids by bid.createdAt and bid.price
    bids.sort((a: any, b: any) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      if (a.price > b.price) return -1;
      if (a.price < b.price) return 1;
      return 0;
    });

    const newAnimal = {
      ...animal,
      bidRoom: null,
      bids: bids,
    };

    response.status = 200;
    response.message = "Animal found successfully.";
    response.data = newAnimal;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const bidding = {
  onAnimal,
};
