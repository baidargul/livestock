import prisma from "@/lib/prisma";
import { ProtocolType } from "../../actions";
const businessProtocols: ProtocolType[] = [
  {
    name: "SellerBiddingCost",
    value: "0.00",
  },
  {
    name: "BuyerBiddingCost",
    value: "1",
  },
  {
    name: "SellerHandShakeCost",
    value: "300",
  },
  {
    name: "BuyerHandShakeCost",
    value: "0",
  },
];

const initializeDefaults = async () => {
  try {
    for (const protocol of businessProtocols) {
      const existingProtocol = await prisma.businessProtocol.findMany({
        where: { name: protocol.name },
      });
      if (existingProtocol.length === 0) {
        console.log(`Creating protocol: ${protocol.name}`);
        await prisma.businessProtocol.create({
          data: {
            name: protocol.name,
            value: protocol.value,
          },
        });
      }
    }
  } catch (error: any) {
    console.error("Error initializing business protocols:", error);
  }
};

const listAll = async () => {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    const protocols = await prisma.businessProtocol.findMany();
    response.status = 200;
    response.message = `${protocols.length} Business protocols listed successfully`;
    response.data = protocols;
    return response;
  } catch (error: any) {
    console.error("Error listing business protocols:", error);
  }
};
const list = async (name: string) => {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    const protocols = await prisma.businessProtocol.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
    response.status = 200;
    response.message = "Business protocol listed successfully";
    response.data = protocols;
    return response;
  } catch (error: any) {
    console.error("Error listing business protocols:", error);
  }
};

const createProtocol = async (protocol: ProtocolType) => {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    if (!protocol.name || !protocol.value) {
      response.status = 400;
      response.message = "Name and value are required";
      return response;
    }
    const theProtocol = await prisma.businessProtocol.upsert({
      where: { name: protocol.name },
      update: { value: protocol.value },
      create: {
        name: protocol.name,
        value: protocol.value,
      },
    });
    response.status = 201;
    response.message = "Business protocol created successfully";
    response.data = theProtocol;
    return response;
  } catch (error: any) {
    console.error("Error creating business protocol:", error);
  }
};

export const BusinessProtocols = {
  defaults: businessProtocols,
  initializeDefaults,
  list,
  listAll,
  createProtocol,
};
