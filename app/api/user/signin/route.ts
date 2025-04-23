import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  } as any;

  try {
    const data = await req.json();
    const { email, password } = data;
    if (!email || !password) {
      response.status = 400;
      response.message = "All fields are required";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.user.signin(email, password);
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
