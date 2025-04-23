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
      select: { name: true, id: true },
    });

    if (isExits) {
      response.status = 400;
      response.message = "User with this email already exists";
      response.data = null;
      return response;
    }

    const user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    if (!user) {
      response.status = 400;
      response.message = "User not created";
      response.data = null;
      return response;
    }

    response.status = 200;
    response.message = "User created successfully";
    response.data = user;
    return response;
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

    let isExits: any = await prisma.users.findFirst({
      where: {
        email: email,
        password: password,
      },
      select: { name: true, id: true },
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
export const user = {
  signin,
  signup,
};
