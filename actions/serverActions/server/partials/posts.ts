import prisma from "@/lib/prisma";
import { actions } from "../../actions";
import { doQuery } from "./Query/Query";
import { calculatePricing } from "@/lib/utils";
async function listAll(value?: string, key?: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const whereClause = value && key ? { [key]: value } : undefined;

    const all = await prisma.animal.findMany({
      where: whereClause,
      include: {
        user: {
          omit: { password: true, email: true },
        },
      },
    });

    const isInDevelopment = process.env.NODE_ENV === "development";

    // Fetch all animals' images in parallel
    const animals = await Promise.all(
      all.map(async (animal) => {
        let images: any[] = [];

        if (!isInDevelopment) {
          images = await actions.server.images.fetchImages(
            animal?.images || []
          );
        }

        return { ...animal, images };
      })
    );

    return {
      status: 200,
      message: "Posts fetched successfully",
      data: animals,
    };
  } catch (error: any) {
    console.log(`[SERVER ERROR] @POST LIST ALL: ${error.message}`);
    return {
      status: 500,
      message: error.message,
      data: null,
    };
  }
}

async function list(val: any, key: string, directReturn?: boolean) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const whereClause = { [key]: val };

    const target: any = await prisma.animal.findFirst({
      where: whereClause,
      include: {
        user: {
          omit: { password: true, email: true },
        },
      },
    });

    if (!target) {
      return { status: 400, message: "Animal not found", data: null };
    }

    const isInDevelopment = process.env.NODE_ENV === "development";

    let animal = { ...target };
    let images: any[] = [];
    let profileImage: any[] = [];
    let coverImage: any[] = [];

    if (!isInDevelopment) {
      // Fetch all images in parallel
      const [animalImages, profileImages, coverImages] = await Promise.all([
        actions.server.images.fetchImages(target.images || []),
        actions.server.images.fetchImages(target.user?.profileImage || []),
        actions.server.images.fetchImages(target.user?.coverImage || []),
      ]);

      images = animalImages;
      profileImage = profileImages;
      coverImage = coverImages;
    }

    animal = {
      ...animal,
      images,
      user: {
        ...animal.user,
        profileImage,
        coverImage,
      },
    };

    if (directReturn) return animal;

    return {
      status: 200,
      message: "Animal fetched successfully",
      data: animal,
    };
  } catch (error: any) {
    console.log(`[SERVER ERROR @POST LIST]: ${error.message}`);
    return { status: 500, message: error.message, data: null };
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
        city: true,
        province: true,
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
        await Promise.all([
          prisma.user.update({
            where: { id: userId },
            data: {
              balance: {
                decrement: Number(protocol.data.value ?? 0),
              },
            },
          }),

          actions.server.user.contacts.createContact(
            userId,
            isExists.userId,
            `Seller`
          ),
          await prisma.animal.update({
            where: {
              id: isExists.id,
            },
            data: {
              maleQuantityAvailable: 0,
              femaleQuantityAvailable: 0,
              sold: true,
            },
          }),
          await actions.server.orders.create(
            isExists.userId,
            userId,
            isExists.id,
            isExists.maleQuantityAvailable ?? 0,
            isExists.femaleQuantityAvailable ?? 0,
            calculatePricing(isExists).price,
            isExists.deliveryOptions,
            user.province ?? "",
            user.city ?? ""
          ),
        ]);
      }
    }

    let contact: any = await prisma.contactBook.findFirst({
      where: {
        authorId: userId,
        userId: isExists.userId,
      },
    });

    if (!contact) {
      response.status = 400;
      response.message = "Contact not found";
      response.data = null;
      return response;
    }

    const postAuthor = await prisma.user.findUnique({
      where: {
        id: contact.userId,
      },
      select: {
        id: true,
        name: true,
        phone: true,
      },
    });

    contact = {
      ...contact,
      user: postAuthor,
    };

    response.status = 200;
    response.message = "Customer contact fetched successfully";
    response.data = {
      ...contact,
      cost: Number(protocol ? protocol.data.value : 0),
    };
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @GET CUSTOMER CONTACT: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function Query(val: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    const result = await doQuery(val);
    response.status = 200;
    response.message = "Posts fetched successfully";
    response.data = result;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @QUERY: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function fetchPosts(take?: number) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    const posts = await prisma.animal.findMany({
      where: { sold: false },
      select: {
        id: true,
      },
      orderBy: { rank: "desc" },
      take,
    });

    const rawPosts = posts.map((post) =>
      actions.server.post.list(post.id, "id", true)
    );
    const thePosts = await Promise.all(rawPosts);

    response.status = 200;
    response.message = `${thePosts.length} posts fetched successfully`;
    response.data = thePosts;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @FETCH POSTS: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const post = {
  fetchPosts,
  list,
  listAll,
  removePost,
  Query,
  placeBid,
  listBids,
  changeBiddingStatus,
  GetCustomerContact,
};
