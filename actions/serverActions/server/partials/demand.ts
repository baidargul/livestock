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

async function list(id: string) {}

async function listAll() {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const allDemands = await prisma.demands.findMany();

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

export const demand = {
  list,
  listAll,
  createDemand,
};
