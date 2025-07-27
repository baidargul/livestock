import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const activeBidRoomId = req.nextUrl.searchParams.get("activeBidRoomId");
    const userId = req.nextUrl.searchParams.get("userId");

    if (!activeBidRoomId) {
      response.status = 400;
      response.message = "Missing activeBidRoomId parameter";
      return new Response(JSON.stringify(response));
    }

    if (!userId) {
      response.status = 400;
      response.message = "Missing userId parameter";
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.bidRoom.GetCustomerContact(
      activeBidRoomId,
      userId
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
