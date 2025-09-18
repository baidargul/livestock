import prisma from "@/lib/prisma";
import { actions } from "../../actions";
import { user } from "./user";
import { calculatePricing } from "@/lib/utils";
import { bidding } from "./bidding";
import { Bids } from "@prisma/client";

export type RoomType = {
  key: string;
  authorId: string;
  userId: string;
  animalId: string;
};

async function createBidRoom(room: any, userId: string, demandId?: string) {
  const response = {
    status: 500,
    message: "Failed to create bid room",
    data: null,
  } as any;

  try {
    let [user, postUser, animal, demand, isExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: room.userId ?? "" } }),
      prisma.user.findUnique({ where: { id: room.authorId ?? "" } }),
      prisma.animal.findUnique({ where: { id: room.animalId ?? "" } }),
      demandId
        ? prisma.demands.findUnique({ where: { id: demandId ?? "" } })
        : null,
      prisma.bidRoom.findUnique({
        where: { key: room.key ?? "" },
        include: { author: true, user: true },
      }),
    ]);

    const transactions = [];

    if (!user)
      return {
        status: 404,
        message: "User that requested the bid room does not exist.",
        data: null,
      };
    if (!postUser)
      return {
        status: 404,
        message: "Post author does not exist.",
        data: null,
      };
    if (!animal)
      return { status: 404, message: "Animal does not exist.", data: null };
    if (demandId && !demand)
      return { status: 404, message: "Demand does not exist.", data: null };

    if (!isExists) {
      let newRoom: any = await prisma.bidRoom.create({
        data: {
          key: room.key,
          authorId: room.authorId,
          userId: room.userId,
          animalId: room.animalId,
          femaleQuantityAvailable: room.femaleQuantityAvailable,
          maleQuantityAvailable: room.maleQuantityAvailable,
          offer: room.offer,
          deliveryOptions: room.deliveryOptions,
          activeUsers: [userId],
          demandId: demandId ?? null,
          city: room.deliveryOptions.includes("SELLER_DELIVERY")
            ? room.city
            : "",
          province: room.deliveryOptions.includes("SELLER_DELIVERY")
            ? room.province
            : "",
        },
      });

      if (!newRoom)
        return {
          status: 500,
          message: "Failed to create bid room.",
          data: null,
        };
      if (!demandId) {
        transactions.push(
          prisma.bids.create({
            data: {
              price: room.offer ?? calculatePricing(animal).price,
              bidRoomId: newRoom.id,
              userId: newRoom.userId,
              intial: false,
              isSeen: false,
            },
          })
        );
      }

      transactions.push(
        prisma.bids.create({
          data: {
            price: calculatePricing({
              ...animal,
              maleQuantityAvailable: room.maleQuantityAvailable,
              femaleQuantityAvailable: room.femaleQuantityAvailable,
            }).price,
            bidRoomId: newRoom.id,
            userId: animal.userId,
            intial: true,
            isSeen: true,
          },
        })
      );

      isExists = newRoom;
    }

    const allExceptThis: any = isExists?.activeUsers.filter(
      (u) => u !== userId
    );
    const newUsers = [...allExceptThis, userId];

    transactions.push(
      prisma.bidRoom.update({
        where: { id: isExists?.id },
        data: { activeUsers: newUsers },
        include: {
          animal: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  city: true,
                  province: true,
                },
              },
            },
          },
          bids: {
            take: 5,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  city: true,
                  province: true,
                  connectionIds: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          user: {
            select: {
              id: true,
              name: true,
              city: true,
              province: true,
              connectionIds: true,
            },
          },
          author: {
            select: { id: true, name: true, connectionIds: true },
          },
        },
      })
    );

    let results: any[] = await prisma.$transaction(transactions);

    let updated = null;
    if (!demandId) {
      updated = results[results.length - 1];
    } else {
      updated = results[results.length - 1];
    }

    // Parallel fetch for contact and images
    const [contactRes, animalImages] = await Promise.all([
      actions.server.user.contacts.list(updated.authorId, updated.userId),
      actions.server.images.fetchImages(updated.animal?.images || []),
    ]);

    const contact = contactRes.status === 200 ? contactRes.data : null;

    updated = {
      ...updated,
      contact,
      animal: { ...updated.animal, images: animalImages },
    };

    return {
      status: 200,
      message: "Bid room created successfully.",
      data: updated,
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    return { status: 500, message: error.message, data: null };
  }
}
async function closeBidRoom(value: string, key: "id" | "key", userId: string) {
  try {
    const existingRoom = await prisma.bidRoom.findFirst({
      where: { [key]: value },
      include: {
        user: { select: { connectionIds: true } },
        author: { select: { connectionIds: true } },
      },
    });

    if (!existingRoom) {
      return { status: 404, message: "Bid room does not exist.", data: null };
    }

    // Delete bids and room in parallel (no await inside Promise.all)
    await Promise.all([
      prisma.bids.deleteMany({
        where: { OR: [{ bidRoomId: null }, { bidRoomId: existingRoom.id }] },
      }),
      prisma.bidRoom.delete({ where: { id: existingRoom.id } }),
      prisma.orders.deleteMany({
        where: {
          animalId: existingRoom.animalId,
          userId: existingRoom.userId,
          authorId: existingRoom.authorId,
        },
      }),
    ]);

    return {
      status: 200,
      message: "Bid room closed successfully.",
      data: existingRoom,
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    return { status: 500, message: error.message, data: null };
  }
}
async function closeDeal(room: any, userId: string, bid: any) {
  try {
    const activeRoom = await prisma.bidRoom.findUnique({
      where: { id: room.id },
    });
    if (!activeRoom)
      return { status: 404, message: "Bid room does not exist.", data: null };

    if (activeRoom.closedAt || activeRoom.closedAmount) {
      return {
        status: 404,
        message: "Bid room has already been closed.",
        data: null,
      };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return { status: 404, message: "User does not exist.", data: null };

    if (activeRoom.userId !== userId && activeRoom.authorId !== userId) {
      return {
        status: 404,
        message: "You are not authorized to close this deal.",
        data: null,
      };
    }

    const [selectedBid, authorLastBid] = await Promise.all([
      prisma.bids.findUnique({
        where: { id: bid.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              city: true,
              province: true,
            },
          },
        },
      }),
      prisma.bids.findFirst({
        where: { bidRoomId: activeRoom.id, userId: activeRoom.authorId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!selectedBid)
      return { status: 404, message: "Bid does not exist.", data: null };
    if (!authorLastBid)
      return {
        status: 404,
        message: "Unable to fetch author bids",
        data: null,
      };

    const bothHasSamePrice =
      Number(authorLastBid.price) === Number(selectedBid.price);
    const OfferAccepted = bothHasSamePrice
      ? true
      : selectedBid.userId !== activeRoom.authorId;

    // Update room close details
    await prisma.bidRoom.update({
      where: { id: room.id },
      data: {
        closedAt: new Date(),
        closedAmount: selectedBid.price ?? 0,
        userOfferAccepted: OfferAccepted,
      },
    });

    if (OfferAccepted) {
      const totalQuantity =
        Number(room.maleQuantityAvailable ?? 0) +
        Number(room.femaleQuantityAvailable ?? 0);

      await prisma.$transaction([
        prisma.bids.deleteMany({
          where: {
            bidRoomId: room.id,
          },
        }),
        prisma.bidRoom.delete({
          where: {
            id: room.id,
          },
        }),
      ]);
      const lead = await actions.server.leads.create(
        room.animalId,
        room.userId,
        {
          amount: Number(Number(selectedBid.price ?? 0) / totalQuantity),
          deliveryOptions: room.deliveryOptions,
          maleQuantityAvailable: room.maleQuantityAvailable,
          femaleQuantityAvailable: room.femaleQuantityAvailable,
          province: selectedBid?.user?.province ?? "",
          city: selectedBid?.user?.city ?? "",
          posted: true,
        }
      );
    }

    // const theRoomResp = await actions.server.bidRoom.list(room.id, "id");
    // if (theRoomResp.status !== 200) return theRoomResp;

    return {
      status: 200,
      message: "Deal closed successfully.",
      data: {
        room: room, //theRoomResp.data,
        bid: selectedBid,
        sold: true, //theRoomResp.data.animal.sold,
      },
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    return { status: 500, message: error.message, data: null };
  }
}

async function list(value: string, key: "id" | "key", bidLimit?: number) {
  const response = {
    status: 500,
    message: "Failed to list bid rooms",
    data: null,
  } as any;

  try {
    const extraClause = bidLimit ? { take: bidLimit } : {};

    let rooms: any = await prisma.bidRoom.findFirst({
      where: { [key]: value },
      include: {
        animal: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                city: true,
                province: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            city: true,
            province: true,
            connectionIds: true,
          },
        },
        author: {
          select: { id: true, name: true, connectionIds: true },
        },
        bids: {
          ...extraClause,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                connectionIds: true,
                city: true,
                province: true,
              },
            },
            BidRoom: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!rooms) {
      return { status: 404, message: "Bid room not found", data: null };
    }

    // Contact & images ko parallel fetch karna
    const [contactRes, animalImages] = await Promise.all([
      actions.server.user.contacts.list(rooms.authorId, rooms.userId),
      actions.server.images.fetchImages(rooms?.animal?.images || []),
    ]);

    const contact = contactRes.status === 200 ? contactRes.data : null;

    rooms = {
      ...rooms,
      contact,
      animal: { ...rooms.animal, images: animalImages },
    };

    return {
      status: 200,
      message: "Bid rooms listed successfully.",
      data: rooms,
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    return { status: 500, message: error.message, data: null };
  }
}

async function listByUser(
  userId: string,
  animalId?: string | null,
  bidLimit?: number | null
) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return {
        status: 404,
        message: `User with ID ${userId} not found`,
        data: null,
      };
    }

    const extraClause = bidLimit ? { take: bidLimit } : {};

    const commonInclude: any = {
      animal: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              city: true,
              province: true,
            },
          },
        },
      },
      bids: {
        ...extraClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              city: true,
              province: true,
              connectionIds: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      user: {
        select: {
          id: true,
          name: true,
          city: true,
          province: true,
          connectionIds: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          connectionIds: true,
        },
      },
    };

    // Parallel fetching
    const [otherRooms, myRooms] = await Promise.all([
      prisma.bidRoom.findMany({
        where: { userId, ...(animalId && { animalId }) },
        include: commonInclude,
        orderBy: { createdAt: "desc" },
      }),
      prisma.bidRoom.findMany({
        where: { authorId: userId, ...(animalId && { animalId }) },
        include: commonInclude,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Helper to attach images
    const attachImages = async (rooms: any[]) =>
      Promise.all(
        rooms.map(async (room) => ({
          ...room,
          animal: {
            ...room.animal,
            images: await actions.server.images.fetchImages(room.animal.images),
          },
        }))
      );

    const [resolvedMyRooms, resolvedOtherRooms] = await Promise.all([
      attachImages(myRooms),
      attachImages(otherRooms),
    ]);

    const totalRooms = resolvedMyRooms.length + resolvedOtherRooms.length;

    return {
      status: 200,
      message: `${totalRooms} bid rooms listed successfully.`,
      data: {
        myRooms: resolvedMyRooms,
        otherRooms: resolvedOtherRooms,
      },
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]:" + error.message);
    return { status: 500, message: error.message, data: null };
  }
}

async function leaveBidRoom(room: RoomType, userId: string) {
  try {
    const existingRoom = await prisma.bidRoom.findUnique({
      where: { key: room.key },
    });

    if (!existingRoom) {
      return {
        status: 404,
        message: "Bid room does not exist.",
        data: null,
      };
    }

    const updatedRoom = await prisma.bidRoom.update({
      where: { id: existingRoom.id },
      data: {
        activeUsers: existingRoom.activeUsers.filter((user) => user !== userId),
      },
    });

    const refreshedRoom = await actions.server.bidRoom.list(
      updatedRoom.id,
      "id",
      0
    );

    return {
      status: 200,
      message: "Bid room left successfully.",
      data: refreshedRoom,
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    return {
      status: 500,
      message: error.message,
      data: null,
    };
  }
}

async function leaveAllBidRooms(userId: string) {
  try {
    const existingRooms = await prisma.bidRoom.findMany({
      where: {
        activeUsers: { has: userId },
      },
    });

    if (!existingRooms.length) {
      return {
        status: 404,
        message: "No bid rooms found.",
        data: null,
      };
    }

    const updatedRooms = await Promise.all(
      existingRooms.map((room) =>
        prisma.bidRoom.update({
          where: { id: room.id },
          data: {
            activeUsers: room.activeUsers.filter((user) => user !== userId),
          },
          include: {
            bids: {
              take: 5,
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    city: true,
                    province: true,
                    connectionIds: true,
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            },
            user: {
              select: {
                id: true,
                name: true,
                city: true,
                province: true,
                connectionIds: true,
              },
            },
            author: {
              select: {
                id: true,
                name: true,
                connectionIds: true,
              },
            },
          },
        })
      )
    );

    return {
      status: 200,
      message: "Bid rooms left successfully.",
      data: updatedRooms,
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    return {
      status: 500,
      message: error.message,
      data: null,
    };
  }
}

async function lockBidAsFinalOffer(bid: Bids, userId: string) {
  try {
    const [isBidExists, existingRoom] = await Promise.all([
      prisma.bids.findUnique({
        where: { id: bid.id },
      }),
      prisma.bidRoom.findUnique({
        where: { id: bid.bidRoomId ?? "" },
        select: {
          id: true,
        },
      }),
    ]);

    if (!existingRoom) {
      return {
        status: 404,
        message: "You cannot lock this room",
        data: null,
      };
    }

    if (!isBidExists) {
      return {
        status: 404,
        message: "Bid not found",
        data: null,
      };
    }

    await prisma.$transaction([
      prisma.bids.updateMany({
        where: {
          bidRoomId: isBidExists.bidRoomId,
          userId: userId,
        },
        data: {
          isFinalOffer: false,
        },
      }),
      prisma.bids.update({
        where: { id: bid.id, userId: userId },
        data: { isFinalOffer: true },
      }),
    ]);

    const roomId = isBidExists.bidRoomId;
    const room = await actions.server.bidRoom.list(roomId ?? "", "id", 3);

    return {
      status: 200,
      message: "Bid locked as final offer successfully.",
      data: room,
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    return {
      status: 500,
      message: error.message,
      data: null,
    };
  }
}

async function bidSeen(bidId: string) {
  try {
    // Update bid and fetch user connectionIds in one go
    const bid = await prisma.bids.update({
      where: { id: bidId },
      data: { isSeen: true },
      include: {
        user: {
          select: { connectionIds: true },
        },
      },
    });

    if (!bid) {
      return {
        status: 404,
        message: "Bid not found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Bid seen successfully.",
      data: bid.user?.connectionIds ?? [],
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    return {
      status: 500,
      message: error.message,
      data: null,
    };
  }
}

async function GetCustomerContact(activeBidRoomId: string, userId: string) {
  try {
    const activeBidRoom = await prisma.bidRoom.findUnique({
      where: { id: activeBidRoomId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            balance: true,
            city: true,
            province: true,
          },
        },
      },
    });

    if (!activeBidRoom) {
      return { status: 404, message: "Room does not exist.", data: null };
    }

    if (!activeBidRoom.user || !activeBidRoom.user.id) {
      return { status: 404, message: "User does not exist.", data: null };
    }

    const isAuthor = activeBidRoom.authorId === userId;

    const protocol = await actions.server.protocols.BusinessProtocols.list(
      isAuthor ? "SellerHandShakeCost" : "BuyerHandShakeCost"
    );

    if (protocol?.status === 200) {
      const cost = Number(protocol.data?.value ?? 0);

      let [thisUser, FreeMode]: any = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { balance: true },
        }),
        prisma.businessProtocol.findFirst({
          where: { name: "FreeMode" },
        }),
      ]);

      FreeMode = FreeMode
        ? Number(FreeMode.value) === 1
          ? true
          : false
        : false;

      if (!FreeMode) {
        if (Number(thisUser?.balance ?? 0) - cost < 0) {
          return { status: 302, message: "Insufficient balance", data: null };
        }
      }

      if (cost > 0) {
        await Promise.all([
          prisma.user.update({
            where: { id: userId },
            data: { balance: { decrement: FreeMode ? 0 : cost } },
          }),
          actions.server.user.contacts.createContact(
            activeBidRoom.authorId,
            activeBidRoom.userId,
            "Buyer"
          ),
        ]);
      }
    }

    return {
      status: 200,
      message: "Customer contact fetched successfully.",
      data: activeBidRoom.user,
    };
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    return { status: 500, message: error.message, data: null };
  }
}

export const bidRoom = {
  list,
  listByUser,
  createBidRoom,
  closeDeal,
  closeBidRoom,
  leaveBidRoom,
  leaveAllBidRooms,
  lockBidAsFinalOffer,
  GetCustomerContact,
  bidSeen,
  bidding,
};
