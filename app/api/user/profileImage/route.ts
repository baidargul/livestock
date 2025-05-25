import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  } as any;

  try {
    const data = await req.json();

    const uploads = await actions.server.images.uploadImages([data.image]);
    if (uploads.status === 400) {
      response.status = 400;
      response.message = `Unable to upload images`;
      response.data = uploads.data;
      return new Response(JSON.stringify(response));
    }

    data.image = uploads.data;

    await prisma.user.update({
      where: { id: data.userId },
      data: { profileImage: data.image },
    });

    response = await actions.server.user.list(data.userId, "id");
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
