import prisma from "@/lib/prisma";
async function signup(name: string, email: string, password: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    if (!name || !email || !password) {
      response.status = 400;
      response.message = "All fields are required";
      response.data = null;
      return response;
    }

    let isExits: any = await prisma.users.findFirst({
      where: {
        email: email,
      },
      select: { name: true },
    });

    if (isExits) {
      response.status = 400;
      response.message = "User already exists";
      response.data = null;
      return response;
    }

    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

export const user = {
  signup,
};
