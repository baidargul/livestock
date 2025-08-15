import prisma from "@/lib/prisma";
async function onAnimal(id: string) {
  try {
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, id: true } },
        BidRoom: {
          include: {
            bids: {
              orderBy: [{ createdAt: "desc" }, { price: "desc" }],
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
                    city: true,
                    province: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!animal) {
      return { status: 400, message: "Animal not found", data: null };
    }

    // Flatten all bids from all rooms
    const bids = animal.BidRoom.flatMap((room) => room.bids);

    return {
      status: 200,
      message: "Animal found successfully.",
      data: {
        ...animal,
        bidRoom: null, // keeping your structure
        bids,
      },
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]:", error.message);
    return { status: 500, message: error.message, data: null };
  }
}

export const bidding = {
  onAnimal,
};
