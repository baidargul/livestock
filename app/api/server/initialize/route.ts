import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let response: any = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    response = await actions.server.protocols.defaults.initializeDefaults();
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
