import prisma from "@/lib/prisma";
import { actions } from "../../actions";

async function create(
  authorId: string,
  userId: string,
  animalId: string,
  orderMaleQuantityAvailable: number,
  orderFemaleQuantityAvailable: number,
  orderPrice: number,
  orderDeliveryOptions: string[],
  deliveryProvince: string,
  deliveryCity: string
) {
  const response: any = {
    status: 500,
    message: "Internal Server Error",
    data: null,
  };
  try {
    const Animal = await prisma.animal.findUnique({
      where: {
        id: animalId,
      },
    });

    if (!Animal) {
      response.status = 400;
      response.message = "Animal not found";
      response.data = null;
      return response;
    }

    const Author = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!Author) {
      response.status = 400;
      response.message = "Author not found";
      response.data = null;
      return response;
    }

    const User = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!User) {
      response.status = 400;
      response.message = "User not found";
      response.data = null;
      return response;
    }

    const postOrder = {
      type: Animal.type,
      breed: Animal.breed,
      averageAge: Animal.averageAge,
      ageUnit: Animal.ageUnit,
      averageWeight: Animal.averageWeight,
      weightUnit: Animal.weightUnit,
      colorMarkings: Animal.colorMarkings,
      priceUnit: Animal.priceUnit,
      maleQuantityAvailable: orderMaleQuantityAvailable,
      femaleQuantityAvailable: orderFemaleQuantityAvailable,
      price: orderPrice,
      deliveryOptions: orderDeliveryOptions,
      province: deliveryProvince,
      city: deliveryCity,
      animalId: animalId,
      authorId,
      userId,
    };

    const order = await prisma.orders.create({
      data: postOrder as any,
    });

    response.status = 200;
    response.message = "Order created successfully";
    response.data = order;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @CREATE ORDER: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

async function getOrderCount(userId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        userOrders: {
          select: {
            id: true,
          },
        },
        authorOrders: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      response.status = 400;
      response.message = "User not found";
      response.data = null;
      return response;
    }

    response.status = 200;
    response.message = `Found ${
      user?.userOrders?.length + user?.authorOrders?.length
    } orders`;
    response.data = {
      buying: user?.userOrders?.length,
      selling: user?.authorOrders?.length,
    };
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @GET ORDER COUNT: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

async function getPurchaseOrders(userId: string, page: number, limit: number) {
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

    const [total, orders] = await Promise.all([
      prisma.orders.count({
        where: {
          userId: user.id,
        },
      }),
      prisma.orders.findMany({
        where: {
          userId: user.id,
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              city: true,
              province: true,
              name: true,
              phone: true,
            },
          },
          user: {
            select: {
              city: true,
              province: true,
              name: true,
              phone: true,
            },
          },
          animal: {
            select: {
              city: true,
              province: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    response.status = 200;
    response.message = `Found ${orders.length} orders`;
    response.data = { orders, total };
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @GET PURCHASE ORDERS: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}
async function withdraw(userId: string, orderId: string) {
  let response = {
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

    const order = await prisma.orders.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      response.status = 400;
      response.message = "Order not found";
      response.data = null;
      return response;
    }

    await prisma.$transaction([
      prisma.orders.delete({
        where: {
          id: orderId,
        },
      }),
      prisma.bidRoom.deleteMany({
        where: {
          OR: [{ userId: userId }, { authorId: userId }],
          animalId: order.animalId,
        },
      }),
    ]);

    response.status = 200;
    response.message = "Order withdrawn successfully";
    response.data = null;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @WITHDRAW ORDER: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

async function getOrderPreview(orderId: string) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    let order: any = await prisma.orders.findUnique({
      where: {
        id: orderId,
      },
      include: {
        author: {
          select: {
            city: true,
            province: true,
            name: true,
            phone: true,
          },
        },
        user: {
          select: {
            city: true,
            province: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      response.status = 400;
      response.message = "Order not found";
      response.data = null;
      return response;
    }

    const animal = await actions.server.post.list(order.animalId, "id");
    order = { ...order, animal: animal.data };

    response.status = 200;
    response.message = "Order found";
    response.data = order;
    return response;
  } catch (error: any) {
    console.log(`[SERVER ERROR] @GET ORDER PREVIEW: ${error.message}`);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const orders = {
  create,
  withdraw,
  getOrderPreview,
  getOrderCount,
  getPurchaseOrders,
};
