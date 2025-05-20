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

    console.time("creating user");
    try {
      const newUser = await prisma.user.create({
        data: { name, email, password },
        omit: {
          password: true,
        },
      });

      response.status = 200;
      response.message = "User created successfully";
      response.data = newUser;
      return response;
    } catch (e: any) {
      if (e.code === "P2002") {
        response.status = 402;
        response.message = "User with this email already exists";
        response.data = null;
        return response;
      }
    }
    console.timeEnd("creating user");
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

async function signin(email: string, password: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    if (!email || !password) {
      response.status = 400;
      response.message = "All fields are required";
      response.data = null;
      return response;
    }

    let isExits: any = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
      select: { name: true, email: true, id: true },
    });

    if (!isExits) {
      response.status = 400;
      response.message = `User with this email not exists or password is incorrect`;
      response.data = null;
      return response;
    }

    response.status = 200;
    response.message = "User logged in successfully";
    response.data = isExits;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}

async function signout(session: any) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const deletedSession = await prisma.sessions.deleteMany({
      where: {
        id: session.token,
      },
    });
    response.status = 200;
    response.message = "User signed out successfully";
    response.data = deletedSession;
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
  signin,
  signup,
  signout,
};
