import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();
    const { animalId, userId, quantites } = data;

    if (!animalId || !userId || !quantites) {
      response.status = 400;
      response.message = "Bad Request: Missing animalId or userId or quantites";
      return new Response(JSON.stringify(response));
    }

    console.log(quantites);
    response = await actions.server.post.adjustQuantity(
      animalId,
      userId,
      Number(quantites.male ?? 0),
      Number(quantites.female ?? 0)
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
