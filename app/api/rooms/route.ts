import { actions } from "@/actions/serverActions/actions";
import { RoomType } from "@/actions/serverActions/server/partials/bidroom";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  } as any;

  try {
    const value = new URL(req.url).searchParams.get("value");
    const key = new URL(req.url).searchParams.get("key");

    if (!value || !key) {
      response.status = 400;
      response.message = "Missing required fields";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.bidRoom.list(value, key as "id" | "key", 5);
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
export async function POST(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();

    const room: RoomType = data.room;
    const userId: string = data.userId;
    const demandId: string = data.demandId ?? null;
    response = await actions.server.bidRoom.createBidRoom(
      room,
      userId,
      demandId
    );
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
export async function PATCH(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();
    const room: RoomType = data.room;
    const userId: string = data.userId;
    response = await actions.server.bidRoom.leaveBidRoom(room, userId);
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
export async function PUT(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();
    const userId: string = data.userId;
    response = await actions.server.bidRoom.leaveAllBidRooms(userId);
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
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const value = new URL(req.url).searchParams.get("value");
    const key = new URL(req.url).searchParams.get("key");
    const userId = new URL(req.url).searchParams.get("userId");

    if (!value || !key) {
      response.status = 400;
      response.message = "Missing required fields";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.bidRoom.closeBidRoom(
      value,
      key as "id" | "key",
      userId ?? ""
    );
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
