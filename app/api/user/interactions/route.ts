import { actions } from "@/actions/serverActions/actions";
import { InteractionType } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const userId = new URL(req.url).searchParams.get("userId");
    const animalId = new URL(req.url).searchParams.get("animalId");
    const type = new URL(req.url).searchParams.get("type") as InteractionType;

    if (!userId || !animalId || !type) {
      response.status = 400;
      response.message = "Missing required fields";
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.user.interactions.saveInteraction(
      userId,
      animalId,
      type
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
