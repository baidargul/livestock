import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const name = new URL(req.url).searchParams.get("name");

  try {
    const response = name
      ? await actions.server.protocols.BusinessProtocols.list(name)
      : await actions.server.protocols.BusinessProtocols.listAll();

    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);

    return new Response(
      JSON.stringify({
        status: 500,
        message: error.message,
        data: null,
      })
    );
  }
}
export async function POST(req: NextRequest) {
  let response: any = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();
    if (!data.name || !data.value) {
      response.status = 400;
      response.message = "Name and value are required";
      return new Response(JSON.stringify(response));
    }

    const protocol = {
      name: data.name,
      value: data.value,
    };

    response = await actions.server.protocols.BusinessProtocols.createProtocol(
      protocol
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
