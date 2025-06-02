import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const userId = new URL(req.url).searchParams.get("userId");
    const animalId = new URL(req.url).searchParams.get("animalId");

    if (!userId) {
      response.status = 400;
      response.message = "Missing required fields: userId";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    if (!animalId) {
      response = await actions.server.bidRoom.listByUser(userId, undefined, 5);
    } else {
      response = await actions.server.bidRoom.listByUser(userId, animalId, 5);
    }
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
