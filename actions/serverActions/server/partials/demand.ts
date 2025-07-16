import prisma from "@/lib/prisma";

async function createDemand(data: any) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const ownedUser = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!ownedUser) {
      response.status = 400;
      response.message = "User not found";
      response.data = null;
      return response;
    }

    const newDemand = await prisma.demands.create({
      data: { ...data },
    });

    response.status = 200;
    response.message = "Demand created successfully";
    response.data = newDemand;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
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
    const demand = await prisma.demands.findFirst({
      where: {
        [key]: val,
      },
      include: {
        user: true,
      },
    });

    if (!demand) {
      response.status = 404;
      response.message = "Demand not found";
      response.data = null;
      return response;
    }

    response.status = 200;
    response.message = "Demand fetched successfully";
    response.data = demand;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function listAll(where?: any) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const allDemands = await prisma.demands.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    response.status = 200;
    response.message = `${allDemands.length} Demands fetched successfully`;
    response.data = allDemands;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

async function removeDemand(id: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const deletedDemand = await prisma.demands.delete({
      where: {
        id,
      },
    });

    response.status = 200;
    response.message = "Demand deleted successfully";
    response.data = deletedDemand;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

async function hasUserPostedOffer(userId: string, demandId: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const room = await prisma.bidRoom.findFirst({
      where: {
        userId: userId,
        demandId: demandId,
      },
    });

    response.status = 200;
    response.message = room ? "User has placed an offer." : "No offer placed";
    response.data = room ? true : false;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const demand = {
  list,
  listAll,
  createDemand,
  removeDemand,
  hasUserPostedOffer,
};
