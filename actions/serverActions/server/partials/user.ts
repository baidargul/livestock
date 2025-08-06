import prisma from "@/lib/prisma";
import { actions } from "../../actions";
import { account } from "./account";
import { contacts } from "./contacts";
import { interactions } from "./interactions";
async function signup(
  name: string,
  email: string,
  password: string,
  province?: string,
  city?: string,
  phone?: string
) {
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
        data: { name, email, password, province, city, phone },
        omit: {
          password: true,
        },
      });

      const profileImage = await actions.server.images.fetchImages(
        newUser.profileImage ?? []
      );
      newUser.profileImage = profileImage;

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
      select: { name: true, email: true, profileImage: true, id: true },
    });

    if (!isExits) {
      response.status = 400;
      response.message = `User with this email not exists or password is incorrect`;
      response.data = null;
      return response;
    }

    const profileImage = await actions.server.images.fetchImages(
      isExits.profileImage ?? []
    );
    isExits.profileImage = profileImage;

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
async function validateSession(token: any) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const session = await prisma.sessions.findFirst({
      where: {
        id: token,
      },
    });

    if (!session) {
      response.status = 400;
      response.message = "Invalid session";
      response.data = null;
      return response;
    }

    if (session.expiry < new Date()) {
      response.status = 400;
      response.message = "Session expired";
      response.data = null;
      return response;
    }

    response.status = 200;
    response.message = "Session validated successfully";
    response.data = session;
    return response;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
async function list(value: string, key: "id" | "email") {
  const data = {
    where: {
      [key]: value,
    },
  };

  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };
  try {
    const user = await prisma.user.findFirst({
      ...data,
      select: {
        animals: true,
        id: true,
        name: true,
        email: true,
        bids: true,
        profileImage: true,
        coverImage: true,
        connectionIds: true,
      },
    });

    if (!user) {
      response.status = 400;
      response.message = "User not found";
      response.data = null;
      return response;
    }

    const profileimage = await actions.server.images.fetchImages(
      user.profileImage ?? []
    );
    const coverimage = await actions.server.images.fetchImages(
      user.coverImage ?? []
    );
    user.profileImage = profileimage;
    user.coverImage = coverimage;

    response.status = 200;
    response.message = "User fetched successfully";
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

export const user = {
  signin,
  signup,
  signout,
  validateSession,
  list,
  account,
  contacts,
  interactions,
};
