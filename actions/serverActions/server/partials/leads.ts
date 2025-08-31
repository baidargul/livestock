import prisma from "@/lib/prisma";
import { actions } from "../../actions";

async function hasLead(animalId: string, userId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const leads = await prisma.leads.findMany({
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

    response.status = 200;
    response.message = `${leads.length} Leads found`;
    response.data = leads;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD CHECK: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function forUser(userId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    let leads = await prisma.leads.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            balance: true,
            city: true,
            province: true,
            phone: true,
          },
        },
        animal: {
          select: {
            id: true,
            maleQuantityAvailable: true,
            femaleQuantityAvailable: true,
            userId: true,
            type: true,
            breed: true,
            price: true,
            priceUnit: true,
            weightUnit: true,
            averageAge: true,
            averageWeight: true,
            ageUnit: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    leads = leads.map((lead) => ({
      ...lead,
      user: {
        ...lead.user,
        phone: lead.sold ? lead.user.phone : null,
      },
    }));
    response.status = 200;
    response.message = `${leads.length} Leads found`;
    response.data = leads;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD FOR USER: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function ImBuying(userId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    let leads = await prisma.leads.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            balance: true,
            city: true,
            province: true,
            phone: true,
          },
        },
        animal: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    leads = leads.map((lead) => ({
      ...lead,
      user: {
        ...lead.user,
        phone: lead.sold ? lead.user.phone : null,
      },
    }));

    const allFetch = [];
    for (const lead of leads) {
      allFetch.push(actions.server.post.list(lead.animalId, "id", true));
    }

    const fetches = await Promise.all(allFetch);
    for (let i = 0; i < leads.length; i++) {
      leads[i].animal = fetches[i];
    }

    response.status = 200;
    response.message = `${leads.length} Leads found`;
    response.data = leads;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD FOR USER: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function ImSelling(userId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    let leads = await prisma.leads.findMany({
      where: {
        animal: {
          userId: userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            balance: true,
            city: true,
            province: true,
            phone: true,
          },
        },
        animal: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    leads = leads.map((lead) => ({
      ...lead,
      user: {
        ...lead.user,
        phone: lead.sold ? lead.user.phone : null,
      },
    }));

    const allFetch = [];
    for (const lead of leads) {
      allFetch.push(actions.server.post.list(lead.animalId, "id", true));
    }

    const fetches = await Promise.all(allFetch);
    for (let i = 0; i < leads.length; i++) {
      leads[i].animal = fetches[i];
    }

    response.status = 200;
    response.message = `${leads.length} Leads found`;
    response.data = leads;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD FOR USER: " + error.message);
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
    let leads = await prisma.leads.findMany({
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
            phone: true,
          },
        },
        animal: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    leads = leads.map((lead) => ({
      ...lead,
      user: {
        ...lead.user,
        phone: lead.sold ? lead.user.phone : null,
      },
    }));
    response.status = 200;
    response.message = `${leads.length} Leads found`;
    response.data = leads;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD FOR ANIMAL: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function create(
  animalId: string,
  userId: string,
  request: {
    deliveryOptions: any[];
    maleQuantityAvailable: number;
    femaleQuantityAvailable: number;
    amount: number;
    posted: boolean;
    city: string;
    province: string;
  }
) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const [user, animal, protocols, BuyerDirectHandShake] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.animal.findUnique({
        where: { id: animalId },
        select: { id: true, userId: true },
      }),
      prisma.businessProtocol.findMany({}),
      prisma.businessProtocol.findFirst({
        where: {
          name: "BuyerDirectHandShakeCost",
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
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

    const BuyerDirectHandShakeCost = BuyerDirectHandShake?.value || 0;

    if (Number(BuyerDirectHandShakeCost) > Number(user.balance ?? 0)) {
      response.status = 305;
      response.message = "You don't have enough balance to create a lead";
      return response;
    } else {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          balance: {
            decrement: Number(BuyerDirectHandShakeCost),
          },
        },
      });
    }

    const newLead = await prisma.leads.create({
      data: {
        animalId: animal.id,
        userId: user.id,
        maleQuantityAvailable: Number(request.maleQuantityAvailable ?? 0),
        femaleQuantityAvailable: Number(request.femaleQuantityAvailable ?? 0),
        city: request.city,
        province: request.province,
        deliveryOptions: request.deliveryOptions || [],
        amount: Number(request.amount) ?? 0,
      },
      select: {
        id: true,
        createdAt: true,
        animalId: true,
        userId: true,
        maleQuantityAvailable: true,
        femaleQuantityAvailable: true,
        city: true,
        province: true,
        amount: true,
        deliveryOptions: true,
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
          phone: true,
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
  return response.map((lead) => ({
    ...lead,
    user: {
      ...lead.user,
      phone: lead.sold ? lead.user.phone : null,
    },
  }));
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

    const [lead, protocol, protocolBuyer] = await Promise.all([
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
              balance: true,
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
      actions.server.protocols.BusinessProtocols.list("BuyerHandShakeCost"),
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

    const buyerHandShakeCost = protocolBuyer
      ? protocolBuyer.status === 200
        ? protocolBuyer.data.value
        : 0
      : 0;

    if (Number(author.balance ?? 0) < Number(sellerHandShakeCost ?? 0)) {
      response.status = 305;
      response.message = "Insufficient balance to perform this action";
      return response;
    }

    if (Number(lead.user.balance ?? 0) < Number(buyerHandShakeCost ?? 0)) {
      response.status = 306;
      response.message =
        "Buyer is on a low balance, please wait while he recharges his account.";
      return response;
    }

    const [updatedLead, contact] = await Promise.all([
      prisma.leads.update({
        where: {
          id: lead.id,
        },
        data: {
          sold: true,
          status: "pending",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              city: true,
              province: true,
            },
          },
        },
      }),
      actions.server.user.contacts.createContact(
        author.id,
        lead.user.id,
        "Buyer",
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
      prisma.user.update({
        where: { id: lead.userId },
        data: {
          balance: {
            decrement: Number(buyerHandShakeCost ?? 0),
          },
        },
      }),
    ]);

    response.status = 200;
    response.message = "Lead converted to sale successfully";
    response.data = { lead: updatedLead, contact: contact?.data };
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD CONVERT TO SALE: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function changeStatus(lead: any, status: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const newLead = await prisma.leads.update({
      where: { id: lead.id },
      data: {
        maleQuantityAvailable: Number(lead.maleQuantityAvailable ?? 0),
        femaleQuantityAvailable: Number(lead.femaleQuantityAvailable ?? 0),
        amount: Number(lead.price ?? 0),
        fixed: lead.fixed ? lead.fixed : false,
        status: status,
      },
    });

    response.status = 200;
    response.message = "Lead status changed successfully";
    response.data = newLead;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR] LEAD CHANGE STATUS: " + error.message);
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
  forUser,
  ImBuying,
  ImSelling,
  changeStatus,
  convertToSale,
  remove,
  listAll,
};
