import { actions } from "@/actions/serverActions/actions";
import prisma from "@/lib/prisma";

async function findProduct(val: string) {
  let products = await prisma.animal.findMany({
    where: {
      OR: [
        { title: { contains: val, mode: "insensitive" } },
        { description: { contains: val, mode: "insensitive" } },
        { breed: { contains: val, mode: "insensitive" } },
        { type: { contains: val, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      breed: true,
      type: true,
      images: true,
      city: true,
      province: true,
    },
  });

  await Promise.all(
    products.map(async (item) => {
      item.images = await actions.server.images.fetchImages(item.images);
    })
  );
  return products;
}
async function findDemand(val: string) {
  let products = await prisma.demands.findMany({
    where: {
      OR: [
        { breed: { contains: val, mode: "insensitive" } },
        { type: { contains: val, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      breed: true,
      type: true,
      city: true,
      province: true,
    },
  });
  return products;
}

export async function doQuery(val: string) {
  let result = {};
  if (val && val.length > 0) {
    const [products, demands] = await Promise.all([
      findProduct(val),
      findDemand(val),
    ]);
    result = { products: products, demands: demands };

    return result;
  } else {
    return null;
  }
}
