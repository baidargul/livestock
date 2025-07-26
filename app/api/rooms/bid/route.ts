import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();
    const { roomKey, userId, amount } = data;

    if (!roomKey || !userId || !amount) {
      response.status = 400;
      response.message = "Missing required fields: roomKey, userId, amount";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.post.placeBid(roomKey, userId, amount);
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
