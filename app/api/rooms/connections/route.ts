import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

// KILLS ALL THE CONNECTIONS (USE WHEN SERVER STARTS)
export async function DELETE(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    Promise.all([
      await prisma.user.updateMany({
        where: {},
        data: {
          connectionIds: [],
        },
      }),

      await prisma.bidRoom.updateMany({
        where: {},
        data: {
          activeUsers: [],
        },
      }),
    ]);

    response.status = 200;
    response.message = "All active connections deleted";
    response.data = null;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
