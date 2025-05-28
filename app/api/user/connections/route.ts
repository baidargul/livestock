import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();
    const { connectionId, userId } = data;

    if (!connectionId) {
      response.status = 400;
      response.message = "Missing required fields: connectionId";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    if (!userId) {
      response.status = 400;
      response.message = "Missing required fields: userId";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      response.status = 404;
      response.message = "User not found";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    const newConnections = user.connectionIds;
    newConnections.push(connectionId);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        connectionIds: newConnections,
      },
    });

    response.status = 200;
    response.message = "User connected successfully";
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

export async function DELETE(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const connectionId = new URL(req.url).searchParams.get("connectionId");

    if (!connectionId) {
      response.status = 400;
      response.message = "Missing required fields: connectionId";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    const user = await prisma.user.findFirst({
      where: {
        connectionIds: {
          has: connectionId,
        },
      },
    });

    if (!user) {
      response.status = 404;
      response.message = "User not found";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    const newConnections = user.connectionIds.filter(
      (id) => id !== connectionId
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        connectionIds: newConnections,
      },
    });

    response.status = 200;
    response.message = "User disconnected successfully";
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
