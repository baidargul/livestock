import prisma from "@/lib/prisma";

async function hasLead(animalId: string, userId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const lead = await prisma.leads.findFirst({
      where: {
        animalId: animalId,
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            balance: true,
          },
        },
        animal: {
          select: {
            id: true,
            userId: true,
            type: true,
            breed: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (lead) {
      response.status = 200;
      response.message = "Lead exists";
      response.data = lead;
    } else {
      response.status = 200;
      response.message = "No lead found";
      response.data = null;
    }
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD CHECK: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function create(animalId: string, userId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const [user, animal, protocols] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.animal.findUnique({
        where: { id: animalId },
        select: { id: true, userId: true },
      }),
      prisma.businessProtocol.findMany({}),
    ]);

    if (!user) {
      response.status = 404;
      response.message = "User not found";
      return response;
    }

    if (!animal) {
      response.status = 404;
      response.message = "Animal not found";
      return response;
    }

    if (user.id === animal.userId) {
      response.status = 400;
      response.message = "You cannot create a lead for your own animal";
      return response;
    }

    const isExists = await hasLead(animal.id, user.id);
    if (isExists.status === 200) {
      if (isExists.data) {
        response.status = 400;
        response.message = "Lead already exists";
        response.data = isExists.data;
        return response;
      }
    } else {
      response.status = isExists.status;
      response.message = isExists.message;
      response.data = isExists.data;
      return response;
    }

    const newLead = await prisma.leads.create({
      data: {
        animalId: animal.id,
        userId: user.id,
      },
      select: {
        id: true,
        createdAt: true,
        animalId: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            balance: true,
          },
        },
      },
    });

    response.status = 200;
    response.message = "Lead created successfully";
    response.data = { ...newLead, protocols: protocols || [] };
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD CREATE: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

async function remove(leadId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const lead = await prisma.leads.delete({
      where: { id: leadId },
    });

    response.status = 200;
    response.message = "Lead deleted successfully";
    response.data = lead;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD DELETE: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const leads = {
  create,
  hasLead,
  remove,
};
