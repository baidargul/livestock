import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const animalId = new URL(req.url).searchParams.get("animalId");
    if (!animalId) {
      response.status = 400;
      response.message = "Animal ID is required";
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.leads.forAnimal(animalId);
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
