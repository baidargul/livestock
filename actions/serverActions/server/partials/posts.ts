import prisma from "@/lib/prisma";
import { actions } from "../../actions";
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
      const images = await actions.server.images.fetchImages(animal?.images);
      animals.push({ ...animal, images });
    }

    response.status = 200;
    response.message = "Posts fetched successfully";
    response.data = animals;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @POST LIST ALL: ${error.message}`);
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
    let images = [];
    let profileImage: any = [];
    let coverImage = [];
    let animal = { ...target };
    const isInDevelopment = process.env.NODE_ENV === "development";
    if (!isInDevelopment) {
      Promise.all([
        (images = await actions.server.images.fetchImages(target.images)),
      ]);
      animal = { ...target, images };
      Promise.all([
        (profileImage = await actions.server.images.fetchImages(
          animal.user.profileImage
        )),
        (coverImage = await actions.server.images.fetchImages(
          animal.user.coverImage
        )),
      ]);
    }

    animal.user.profileImage = profileImage;
    animal.user.coverImage = coverImage;

    response.status = 200;
    response.message = "Animal fetched successfully";
    response.data = animal;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR @POST LIST]: ${error.message}`);
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
    console.log(`[SERVER ERROR] @POST REMOVE: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function placeBid(roomKey: string, userId: string, amount: number) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      response.status = 400;
      response.message = "User not found";
      response.data = null;
      return response;
    }

    const room = await prisma.bidRoom.findFirst({
      where: {
        key: roomKey,
      },
    });

    if (!room) {
      response.status = 400;
      response.message = `Room not found, or closed.`;
      response.data = null;
      return response;
    }

    if (room.userId !== userId && room.authorId !== userId) {
      response.status = 400;
      response.message = `You're not allowed to bid on this room.`;
      response.data = null;
      return response;
    }

    const isAuthor = room.authorId === userId;
    let BusinessProtocol =
      await actions.server.protocols.BusinessProtocols.list(
        isAuthor ? "SellerBiddingCost" : "BuyerBiddingCost"
      );

    if (BusinessProtocol && BusinessProtocol?.status === 200) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          balance: true,
        },
      });
      if (
        !(
          Number(Number(user?.balance) - Number(BusinessProtocol.data.value)) <
          0
        )
      ) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            balance: {
              decrement: Number(BusinessProtocol.data.value ?? 0),
            },
          },
        });
      } else {
        response.status = 302;
        response.message = `You don't have enough balance to place this bid.`;
        response.data = null;
        return response;
      }
    }

    const bid = await prisma.bids.create({
      data: {
        userId,
        bidRoomId: room.id,
        price: amount,
      },
    });

    let bidRoom: any = await actions.server.bidRoom.list(roomKey, "key", 5);

    response.status = 200;
    response.message = "Bid placed successfully";
    response.data = bidRoom.data;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @PLACE BID: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function listBids(roomId: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    let bids: any = await prisma.bids.findMany({
      where: {
        bidRoomId: roomId,
      },
      include: {
        user: {
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

    if (bids && bids.length > 0) {
      let raw = [];
      for (const bid of bids) {
        const profileImage = await actions.server.images.fetchImages(
          (bid.user && bid.user.profileImage) ?? []
        );
        raw.push({ ...bid, user: { ...bid.user, profileImage } });
      }
      bids = raw;
    }

    response.status = 200;
    response.message = "Bids fetched successfully";
    response.data = bids;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @LIST BIDS: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function changeBiddingStatus(postId: string, allowBidding: boolean) {
  let response: any = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    let isExists = await prisma.animal.findFirst({
      where: { id: postId },
    });

    if (!isExists) {
      response.status = 400;
      response.message = "Post not found";
      response.data = null;
      return response;
    }

    let updatedPost: any = await prisma.animal.update({
      where: { id: postId },
      data: { allowBidding },
    });

    updatedPost = await actions.server.post.list(updatedPost.id, "id");
    response = updatedPost;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @CHANGE BIDDING STATUS: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

async function GetCustomerContact(postId: string, userId: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    let isExists = await prisma.animal.findFirst({
      where: { id: postId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!isExists) {
      response.status = 400;
      response.message = "Post not found";
      response.data = null;
      return response;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!user) {
      response.status = 400;
      response.message = "User not found";
      response.data = null;
      return response;
    }

    const protocol = await actions.server.protocols.BusinessProtocols.list(
      "BuyerDirectHandShakeCost"
    );
    if (protocol && protocol.status === 200) {
      const cost = Number(
        Number(user.balance ?? 0) - Number(protocol.data.value ?? 0)
      );
      if (cost < 0) {
        response.status = 302;
        response.message = `You don't have enough balance to place this bid.`;
        response.data = null;
        return response;
      } else {
        Promise.all([
          await prisma.user.update({
            where: { id: userId },
            data: {
              balance: {
                decrement: Number(protocol.data.value ?? 0),
              },
            },
          }),

          await actions.server.user.contacts.createContact(
            userId,
            isExists.userId,
            `Seller`
          ),
        ]);
      }
    }

    const post = await prisma.animal.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!post) {
      response.status = 400;
      response.message = "Post not found";
      response.data = null;
      return response;
    }

    response.status = 200;
    response.message = "Customer contact fetched successfully";
    response.data = post.user;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @GET CUSTOMER CONTACT: ${error.message}`);
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
  placeBid,
  listBids,
  changeBiddingStatus,
  GetCustomerContact,
};
