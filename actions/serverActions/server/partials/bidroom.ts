import prisma from "@/lib/prisma";

export type RoomType = {
  key: string;
  authorId: string;
  userId: string;
  animalId: string;
};

async function createBidRoom(room: RoomType, userId: string) {
  const response = {
    status: 500,
    message: "Failed to create bid room",
    data: null,
  } as any;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: room.userId,
      },
    });

    if (!user) {
      response.status = 404;
      response.message = `User that requested the bid room does not exist.`;
      return response;
    }

    const postUser = await prisma.user.findUnique({
      where: {
        id: room.authorId,
      },
    });

    if (!postUser) {
      response.status = 404;
      response.message = `Post author does not exist.`;
      return response;
    }

    const animal = await prisma.animal.findUnique({
      where: {
        id: room.animalId,
      },
    });

    if (!animal) {
      response.status = 404;
      response.message = `Animal does not exist.`;
      return response;
    }

    const existingRoom = await prisma.bidRoom.findUnique({
      where: {
        key: room.key,
      },
      include: {
        bids: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (existingRoom) {
      const allExceptThis = existingRoom.activeUsers.filter(
        (user) => user !== userId
      );
      const newUsers = [...allExceptThis, userId];
      const updated = await prisma.bidRoom.update({
        where: {
          id: existingRoom.id,
        },
        data: {
          activeUsers: newUsers,
        },
        include: {
          bids: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      response.status = 201;
      response.message = "Bid room already exists.";
      response.data = updated;
      return response;
    }

    const newRoom = await prisma.bidRoom.create({
      data: {
        key: room.key,
        authorId: room.authorId,
        userId: room.userId,
        animalId: room.animalId,
        activeUsers: [userId],
      },
      include: {
        bids: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    response.status = 200;
    response.message = "Bid room created successfully.";
    response.data = newRoom;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    return response;
  }
}
async function closeBidRoom(value: string, key: "id" | "key") {
  const response = {
    status: 500,
    message: "Failed to close bid room",
    data: null,
  } as any;

  try {
    const existingRoom = await prisma.bidRoom.findFirst({
      where: {
        [key]: value,
      },
    });

    if (!existingRoom) {
      response.status = 404;
      response.message = `Bid room does not exist.`;
      return response;
    }

    const room = await prisma.bidRoom.delete({
      where: {
        id: existingRoom.id,
      },
    });

    response.status = 200;
    response.message = "Bid room closed successfully.";
    response.data = room;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    return response;
  }
}
async function list(value: string, key: "id" | "key") {
  const response = {
    status: 500,
    message: "Failed to list bid rooms",
    data: null,
  } as any;

  try {
    const rooms = await prisma.bidRoom.findMany({
      where: {
        [key]: value,
      },
      include: {
        bids: {
          include: {
            user: true,
          },
        },
      },
    });

    if (rooms.length === 0) {
      response.status = 404;
      response.message = `No bid rooms found.`;
      return response;
    }

    response.status = 200;
    response.message = "Bid rooms listed successfully.";
    response.data = rooms;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    return response;
  }
}
async function listByUser(userId: string, animalId?: string) {
  const response = {
    status: 500,
    message: "Failed to list bid rooms by user id",
    data: null,
  } as any;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    let whereClause: any = {
      userId: userId,
    };

    if (animalId) {
      whereClause = { ...whereClause, animalId: animalId };
    }

    if (!user) {
      response.status = 404;
      response.message = `User with ID ${userId} not found`;
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    const otherRooms = await prisma.bidRoom.findMany({
      where: whereClause,
      include: {
        bids: {
          include: {
            user: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    whereClause = {
      authorId: userId,
    };

    if (animalId) {
      whereClause = { ...whereClause, animalId: animalId };
    }

    const myRooms = await prisma.bidRoom.findMany({
      where: whereClause,
      include: {
        bids: {
          include: {
            user: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const rooms = {
      myRooms: myRooms,
      otherRooms: otherRooms,
    };

    response.status = 200;
    response.message = `${
      Number(otherRooms.length) + Number(myRooms.length)
    } bid rooms listed successfully.`;
    response.data = rooms;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    return response;
  }
}
async function leaveBidRoom(room: RoomType, userId: string) {
  const response = {
    status: 500,
    message: "Failed to leave bid room",
    data: null,
  } as any;

  try {
    const existingRoom = await prisma.bidRoom.findUnique({
      where: {
        key: room.key,
      },
    });

    if (!existingRoom) {
      response.status = 404;
      response.message = `Bid room does not exist.`;
      return response;
    }

    const newUsers = existingRoom.activeUsers.filter((user) => user !== userId);

    const updated = await prisma.bidRoom.update({
      where: {
        id: existingRoom.id,
      },
      data: {
        activeUsers: newUsers,
      },
      include: {
        bids: {
          include: {
            user: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    response.status = 200;
    response.message = "Bid room left successfully.";
    response.data = updated;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    return response;
  }
}
async function leaveAllBidRooms(userId: string) {
  const response = {
    status: 500,
    message: "Failed to leave all bid rooms",
    data: null,
  } as any;

  try {
    const existingRooms = await prisma.bidRoom.findMany({
      where: {
        activeUsers: {
          has: userId,
        },
      },
    });

    if (existingRooms.length === 0) {
      response.status = 404;
      response.message = `No bid rooms found.`;
      return response;
    }

    for (const room of existingRooms) {
      const newUsers = room.activeUsers.filter((user) => user !== userId);
      await prisma.bidRoom.update({
        where: {
          id: room.id,
        },
        data: {
          activeUsers: newUsers,
        },
        include: {
          bids: {
            include: {
              user: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    response.status = 200;
    response.message = "Bid rooms left successfully.";
    response.data = existingRooms;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    return response;
  }
}

export const bidRoom = {
  list,
  listByUser,
  createBidRoom,
  closeBidRoom,
  leaveBidRoom,
  leaveAllBidRooms,
};
