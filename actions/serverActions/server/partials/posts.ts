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

    if (!all.length) {
      return {
        status: 200,
        message: "No posts found",
        data: [],
      };
    }

    const isInDevelopment = process.env.NODE_ENV === "development";
    if (isInDevelopment) {
      return {
        status: 200,
        message: "Posts fetched successfully",
        data: all.map((animal) => ({
          ...animal,
          images: [],
          user: { ...animal.user, profileImage: [], coverImage: [] },
        })),
      };
    }

    // Collect all keys in one go
    const allAnimalImages = all.flatMap((a) => a?.images || []);
    const allProfileImages = all.flatMap((a) => a?.user?.profileImage || []);
    const allCoverImages = all.flatMap((a) => a?.user?.coverImage || []);

    // Fetch all images in parallel
    const [animalImagesFetched, profileImagesFetched, coverImagesFetched] =
      await Promise.all([
        actions.server.images.fetchImages(allAnimalImages),
        actions.server.images.fetchImages(allProfileImages),
        actions.server.images.fetchImages(allCoverImages),
      ]);

    // Map back images to each animal
    const animals = all.map((animal: any) => ({
      ...animal,
      images: animalImagesFetched.filter((img: any) =>
        (animal?.images || []).some((orig: any) => orig.Key === img.name)
      ),
      user: {
        ...animal.user,
        profileImage: profileImagesFetched.filter((img: any) =>
          (animal?.user?.profileImage || []).some(
            (orig: any) => orig.Key === img.name
          )
        ),
        coverImage: coverImagesFetched.filter((img: any) =>
          (animal?.user?.coverImage || []).some(
            (orig: any) => orig.Key === img.name
          )
        ),
      },
    }));

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

    await actions.server.images.deleteImages(images?.images as any);

    const transactions = [];

    transactions.push(
      prisma.bidRoom.deleteMany({
        where: {
          animalId: id,
        },
      })
    );

    transactions.push(
      prisma.leads.deleteMany({
        where: {
          animalId: id,
        },
      })
    );

    transactions.push(
      prisma.boughtPosts.deleteMany({
        where: {
          animalId: id,
        },
      })
    );

    transactions.push(
      prisma.orders.deleteMany({
        where: {
          animalId: id,
        },
      })
    );

    transactions.push(
      prisma.animal.delete({
        where: { id },
      })
    );

    const deletedPost = await prisma.$transaction(transactions);
    response.status = 200;
    response.message = "Post deleted successfully";
    response.data = deletedPost[0];
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
    let [user, room, protocols] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
      prisma.bidRoom.findFirst({
        where: {
          key: roomKey,
        },
      }),
      await prisma.businessProtocol.findMany({}),
    ]);

    if (!user) {
      response.status = 400;
      response.message = "User not found";
      response.data = null;
      return response;
    }

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
    let BusinessProtocol = protocols.find(
      (protocol) =>
        protocol.name === (isAuthor ? "SellerBiddingCost" : "BuyerBiddingCost")
    );
    let FreeMode: any = protocols.find(
      (protocol) => protocol.name === "FreeMode"
    );
    FreeMode = FreeMode ? (Number(FreeMode.value) === 1 ? true : false) : false;

    if (BusinessProtocol && !FreeMode) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          balance: true,
        },
      });
      if (
        !(Number(Number(user?.balance) - Number(BusinessProtocol.value)) < 0)
      ) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            balance: {
              decrement: FreeMode ? 0 : Number(BusinessProtocol.value ?? 0),
            },
          },
        });
      } else {
        if (!FreeMode) {
          response.status = 302;
          response.message = `You don't have enough balance to place this bid.`;
          response.data = null;
          return response;
        }
      }
    }

    const [bid, bidRoom] = await Promise.all([
      prisma.bids.create({
        data: {
          userId,
          bidRoomId: room.id,
          price: amount,
        },
      }),
      actions.server.bidRoom.list(roomKey, "key", 5),
    ]);

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
      include: {
        leads: {
          include: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        BidRoom: {
          include: {
            bids: {
              include: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!isExists) {
      response.status = 400;
      response.message = "Post not found";
      response.data = null;
      return response;
    }

    const transactions = [];
    let [
      BuyerHandShakeCost,
      BuyerDirectHandShakeCost,
      BuyerBiddingCost,
      FreeMode,
    ]: any = await prisma.$transaction([
      prisma.businessProtocol.findFirst({
        where: {
          name: "BuyerHandShakeCost",
        },
      }),
      prisma.businessProtocol.findFirst({
        where: {
          name: "BuyerDirectHandShakeCost",
        },
      }),
      prisma.businessProtocol.findFirst({
        where: {
          name: "BuyerBiddingCost",
        },
      }),
      prisma.businessProtocol.findFirst({
        where: {
          name: "FreeMode",
        },
      }),
    ]);

    BuyerDirectHandShakeCost = Number(BuyerDirectHandShakeCost?.value ?? 0);
    BuyerHandShakeCost = Number(BuyerHandShakeCost?.value ?? 0);
    BuyerBiddingCost = Number(BuyerBiddingCost?.value ?? 0);
    FreeMode = Number(FreeMode?.value ?? 0) === 1 ? true : false;

    if (isExists.allowBidding === false) {
      for (const lead of isExists.leads) {
        transactions.push(
          prisma.user.update({
            where: { id: lead.user.id },
            data: {
              balance: {
                increment: FreeMode ? 0 : Number(BuyerHandShakeCost),
              },
            },
          })
        );
        transactions.push(
          prisma.leads.delete({
            where: {
              id: lead.id,
            },
          })
        );
        transactions.push(
          prisma.bidRoom.deleteMany({
            where: {
              animalId: lead.animalId,
            },
          })
        );
      }
    } else {
      for (const room of isExists.BidRoom) {
        for (const bid of room.bids) {
          transactions.push(
            prisma.user.update({
              where: { id: bid?.user?.id },
              data: {
                balance: {
                  increment: FreeMode ? 0 : Number(BuyerBiddingCost),
                },
              },
            })
          );
          transactions.push(
            prisma.bids.delete({
              where: {
                id: bid.id,
              },
            })
          );
        }
        transactions.push(
          prisma.bidRoom.delete({
            where: {
              id: room.id,
            },
          })
        );
        transactions.push(
          prisma.leads.deleteMany({
            where: {
              animalId: room.animalId ?? postId,
            },
          })
        );
      }
    }

    const result = await prisma.$transaction(transactions);

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

    let [protocol, FreeMode]: any = await Promise.all([
      actions.server.protocols.BusinessProtocols.list(
        "BuyerDirectHandShakeCost"
      ),
      prisma.businessProtocol.findFirst({
        where: {
          name: "FreeMode",
        },
      }),
    ]);

    FreeMode = FreeMode ? (Number(FreeMode.value) === 1 ? true : false) : false;

    if (protocol && protocol.status === 200) {
      const cost = FreeMode
        ? 0
        : Number(Number(user.balance ?? 0) - Number(protocol.data.value ?? 0));
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
                decrement: FreeMode ? 0 : Number(protocol.data.value ?? 0),
              },
            },
          }),

          actions.server.user.contacts.createContact(
            userId,
            isExists.userId,
            `Seller`,
            isExists.id
          ),
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
      cost: FreeMode ? 0 : Number(protocol ? protocol.data.value : 0),
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

async function adjustQuantity(
  animalId: string,
  userId: string,
  maleQuantityAvailable: number,
  femaleQuantityAvailable: number
) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const animal = await prisma.animal.findUnique({
      where: {
        id: animalId,
        userId: userId,
      },
    });

    if (!animal) {
      response.status = 400;
      response.message = "Animal not found or not owned by you";
      response.data = null;
      return response;
    }

    await prisma.animal.update({
      where: { id: animalId },
      data: {
        maleQuantityAvailable: Number(maleQuantityAvailable ?? 0),
        femaleQuantityAvailable: Number(femaleQuantityAvailable ?? 0),
      },
    });
    response.status = 200;
    response.message = "Quantity adjusted successfully";
    response.data = null;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @ADJUST QUANTITY: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

async function getDirectNumber(userId: string, postId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const [user, animal] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          phone: true,
        },
      }),
      prisma.animal.findUnique({
        where: {
          id: postId,
          userId: userId,
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
      }),
    ]);

    if (!user) {
      response.status = 400;
      response.message = "User not found";
      response.data = null;
      return response;
    }

    if (!animal) {
      response.status = 400;
      response.message = "Animal not found or not owned by you";
      response.data = null;
      return response;
    }

    const transactions = [];
    transactions.push(
      prisma.contactBook.create({
        data: {
          authorId: user.id,
          userId: animal.user.id,
          remarks: "Seller",
        },
      })
    );

    let [contact]: any = await prisma.$transaction(transactions);

    contact = await actions.server.user.contacts.list(user.id, animal.user.id);
    contact = contact.data;

    response.status = 200;
    response.message = "Direct number fetched successfully";
    response.data = { contact: contact };
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @GET DIRECT NUMBER: ${error.message}`);
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
  adjustQuantity,
  getDirectNumber,
};
