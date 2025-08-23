import prisma from "@/lib/prisma";
import { actions } from "../../actions";
import { calculatePricing } from "@/lib/utils";

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
async function forAnimal(animalId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const leads = await prisma.leads.findMany({
      where: {
        animalId: animalId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            balance: true,
            city: true,
            province: true,
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
    if (leads.length > 0) {
      response.status = 200;
      response.message = "Leads found";
      response.data = leads;
    } else {
      response.status = 404;
      response.message = "No leads found for this animal";
      response.data = null;
    }
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD FOR ANIMAL: " + error.message);
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
async function listAll() {
  const response = await prisma.leads.findMany({
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
  });
  return response;
}

async function convertToSale(currentUserId: string, leadId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const author = await prisma.user.findUnique({
      where: { id: currentUserId },
    });
    if (!author) {
      response.status = 404;
      response.message = "User not found";
      return response;
    }

    const [lead, protocol] = await Promise.all([
      prisma.leads.findUnique({
        where: { id: leadId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              province: true,
              city: true,
            },
          },
          animal: {
            select: {
              id: true,
              userId: true,
              type: true,
              breed: true,
              maleQuantityAvailable: true,
              femaleQuantityAvailable: true,
              cargoPrice: true,
              price: true,
              priceUnit: true,
              averageAge: true,
              averageWeight: true,
              ageUnit: true,
              weightUnit: true,
              deliveryOptions: true,
            },
          },
        },
      }),
      actions.server.protocols.BusinessProtocols.list("SellerHandShakeCost"),
    ]);

    if (!lead) {
      response.status = 404;
      response.message = "Lead not found";
      return response;
    }

    if (!lead.animal) {
      response.status = 404;
      response.message = "Animal not found for this lead";
      return response;
    }

    const sellerHandShakeCost = protocol
      ? protocol.status === 200
        ? protocol.data.value
        : 0
      : 0;

    const [order, contact] = await Promise.all([
      actions.server.orders.create(
        author.id,
        lead.userId,
        lead.animalId,
        Number(lead.animal.maleQuantityAvailable ?? 0),
        Number(lead.animal.femaleQuantityAvailable ?? 0),
        calculatePricing(lead.animal).price,
        lead.animal.deliveryOptions,
        lead.user.province || "",
        lead.user.city || ""
      ),
      actions.server.user.contacts.createContact(
        author.id,
        lead.user.id,
        "Converted lead to sale",
        lead.animal.id
      ),
      prisma.user.update({
        where: { id: author.id },
        data: {
          balance: {
            decrement: Number(sellerHandShakeCost ?? 0),
          },
        },
      }),
    ]);

    if (order.status !== 200) {
      return order;
    }

    await actions.server.leads.remove(lead.id);

    response.status = 200;
    response.message = "Lead converted to sale successfully";
    response.data = order.data;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD CONVERT TO SALE: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const leads = {
  create,
  hasLead,
  forAnimal,
  convertToSale,
  remove,
  listAll,
};
