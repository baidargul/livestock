import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const postId = new URL(req.url).searchParams.get("postId");
    const userId = new URL(req.url).searchParams.get("userId");
    if (!postId) {
      response.status = 400;
      response.message = "Missing required field: postId";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    if (!userId) {
      response.status = 400;
      response.message = "Missing required field: userId";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.post.GetCustomerContact(postId, userId);
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
