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
    const page = new URL(req.url).searchParams.get("page");
    const limit = new URL(req.url).searchParams.get("limit");

    if (!userId || !page || !limit) {
      response.status = 400;
      response.message = "Missing required fields";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.orders.getSellingOrders(
      userId,
      Number(page ?? 1),
      Number(limit ?? 5)
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
