import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const postId = new URL(req.url).searchParams.get("postId");
    const allowBidding = new URL(req.url).searchParams.get("allowBidding");

    if (!postId || !allowBidding) {
      response.status = 400;
      response.message = "Missing postId or allowBidding parameter";
      return new Response(JSON.stringify(response), { status: 400 });
    }

    response = await actions.server.post.changeBiddingStatus(
      postId,
      allowBidding === "true"
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
