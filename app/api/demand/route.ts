import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();

    const response = await actions.server.demand.createDemand(data);
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
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const id = new URL(req.url).searchParams.get("id");
    const where = new URL(req.url).searchParams.get("where");
    if (id) {
      const response = await actions.server.demand.list(id, "id");
      return new Response(JSON.stringify(response));
    } else {
      const response = await actions.server.demand.listAll(
        where ? where : null
      );
      return new Response(JSON.stringify(response));
    }
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
export async function DELETE(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      response.status = 400;
      response.message = "Demand ID is required";
      return new Response(JSON.stringify(response));
    }

    const deleteResponse = await actions.server.demand.removeDemand(id);
    return new Response(JSON.stringify(deleteResponse));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
