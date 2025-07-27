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
    const amount = new URL(req.url).searchParams.get("amount");

    if (!userId || !amount) {
      response.status = 400;
      response.message = "Missing userId or amount parameter";
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.user.account.recharge(
      userId,
      parseInt(amount)
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
