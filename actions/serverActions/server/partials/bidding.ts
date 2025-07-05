import prisma from "@/lib/prisma";
async function inRoom(id: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const room = await prisma.bidRoom.findUnique({
      where: {
        id: id,
      },
      include: {
        bids: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [{ createdAt: "desc" }, { price: "desc" }],
          select: {
            id: true,
            price: true,
            isFinalOffer: true,
          },
        },
      },
    });

    if (!room) {
      response.status = 404;
      response.message = "Room not found";
      response.data = null;
      return response;
    }
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const bidding = {
  inRoom,
};
