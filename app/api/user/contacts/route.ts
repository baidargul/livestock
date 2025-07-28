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
    const targetUserId = new URL(req.url).searchParams.get("targetUserId");
    if (!userId) {
      response.status = 400;
      response.message = "Missing userId parameter";
      return new Response(JSON.stringify(response));
    }
    if (targetUserId) {
      response = await actions.server.user.contacts.list(userId, targetUserId);
    } else {
      response = await actions.server.user.contacts.listAll(userId);
    }
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
export async function POST(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const authorId = req.nextUrl.searchParams.get("authorId");
    const userId = req.nextUrl.searchParams.get("userId");
    const remarks = req.nextUrl.searchParams.get("remarks") || "";

    if (!authorId || !userId) {
      response.status = 400;
      response.message = "Missing required fields: authorId, userId";
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.user.contacts.createContact(
      authorId,
      userId,
      remarks
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
export async function DELETE(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const contactId = req.nextUrl.searchParams.get("contactId");
    if (!contactId) {
      response.status = 400;
      response.message = "Missing contactId parameter";
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.user.contacts.deleteContact(contactId);
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
export async function PATCH(req: NextRequest) {
  let response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const contactId = req.nextUrl.searchParams.get("contactId");

    if (!contactId) {
      response.status = 400;
      response.message = "Missing contactId parameter";
      return new Response(JSON.stringify(response));
    }

    response = await actions.server.user.contacts.toggleFavorite(contactId);
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
