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

export const BusinessProtocols = {
  defaults: businessProtocols,
  initializeDefaults,
};
