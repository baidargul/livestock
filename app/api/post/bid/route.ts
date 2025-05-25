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

    const { userId, postId, amount } = data;
    if (!userId || !postId || !amount) {
      response.status = 400;
      response.message = "Missing required fields: userId, postId, amount";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.post.placeBid(userId, postId, amount);
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

export async function GET(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const postId = new URL(req.url).searchParams.get("postId");
    if (!postId) {
      response.status = 400;
      response.message = "Missing required field: postId";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.post.listBids(postId);
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
