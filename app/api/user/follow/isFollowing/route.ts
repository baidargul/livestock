import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  } as any;

  try {
    const data = await req.json();
    const { targetUserId, currentUserId } = data;
    if (!targetUserId || !currentUserId) {
      response.status = 400;
      response.message = "Invalid request data";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    const fetch: any = await actions.server.user.isFollowing(
      currentUserId,
      targetUserId
    );

    response.status = fetch.status;
    response.message = fetch.message;
    response.data = fetch.data;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
