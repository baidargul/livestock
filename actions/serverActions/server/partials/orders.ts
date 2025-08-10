import prisma from "@/lib/prisma";

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

export const orders = {
  create,
};
