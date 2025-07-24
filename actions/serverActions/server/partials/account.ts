import prisma from "@/lib/prisma";

async function getBalance(userId: string) {
  try {
    const isExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!isExists) {
      return {
        status: 404,
        message: "User not found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Balance retrieved successfully",
      data: { balance: isExists.balance },
    };
  } catch (error: any) {
    console.error("[SERVER ERROR]: " + error.message);
    return {
      status: 500,
      message: error.message,
      data: null,
    };
  }
}

export const account = {
  getBalance,
};
