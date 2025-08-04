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

async function recharge(userId: string, amount: number) {
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

    if (!isExists.balance) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          balance: 0,
        },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: amount,
        },
      },
      select: { balance: true },
    });
    return {
      status: 200,
      message: "Recharge successful",
      data: { balance: updatedUser.balance },
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
  recharge,
  getBalance,
};
