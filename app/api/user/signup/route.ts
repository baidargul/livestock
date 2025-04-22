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

    if (!data.name || !data.email || !data.password) {
      response.status = 400;
      response.message = "All fields are required";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    const { name, email, password } = data;

    response = await actions.server.user.signup(name, email, password);
    if (response.status !== 200) {
      return new Response(JSON.stringify(response));
    }

    response.status = 200;
    response.message = "User signed up successfully";
    response.data = {};
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
