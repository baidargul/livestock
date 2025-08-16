import prisma from "@/lib/prisma";

async function createContact(
  authorId: string,
  userId: string,
  remarks?: string,
  postId?: string
) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    let isExists = await prisma.contactBook.findFirst({
      where: {
        authorId: authorId,
        userId: userId,
      },
    });

    if (isExists) {
      await prisma.contactBook.update({
        where: {
          id: isExists.id,
        },
        data: {
          remarks: remarks || "",
        },
      });
    } else {
      isExists = await prisma.contactBook.create({
        data: {
          authorId: authorId,
          userId: userId,
          remarks: remarks || "",
        },
      });
    }

    if (postId) {
      const animal = await prisma.animal.findUnique({
        where: {
          id: postId,
        },
        select: {
          id: true,
        },
      });

      if (animal) {
        const post = await prisma.boughtPosts.findFirst({
          where: {
            contactId: isExists.id,
            animalId: animal.id,
          },
        });

        if (!post) {
          await prisma.boughtPosts.create({
            data: {
              contactId: isExists.id,
              animalId: animal.id,
            },
          });
        }
      }
    }

    response.status = 200;
    response.message = "Contact created successfully";
    response.data = null;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
  }

  return response;
}
async function listAll(userId: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const contacts = await prisma.contactBook.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        boughtPosts: {
          include: {
            animal: {
              select: {
                id: true,
                title: true,
                description: true,
                price: true,
                type: true,
                breed: true,
                maleQuantityAvailable: true,
                femaleQuantityAvailable: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    let book = [];
    for (const user of contacts) {
      if (user.userId) {
        const contact = await prisma.user.findUnique({
          where: {
            id: user.userId,
          },
          select: {
            name: true,
            phone: true,
            city: true,
            province: true,
          },
        });
        if (contact) {
          book.push({ ...user, user: { ...contact, id: user.userId } });
        }
      }
    }

    response.status = 200;
    response.message = `${book.length} Contacts retrieved successfully`;
    response.data = book;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
  }

  return response;
}
async function list(userId: string, targetUserId: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    let contact: any = await prisma.contactBook.findFirst({
      where: {
        authorId: userId,
        userId: targetUserId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (contact) {
      const user = await prisma.user.findUnique({
        where: {
          id: contact.userId,
        },
        select: {
          name: true,
          phone: true,
          city: true,
          province: true,
        },
      });

      contact = {
        ...contact,
        user: user ? { ...user, id: contact.userId } : null,
      };
    }
    response.status = 200;
    response.message = `Contact retrieved successfully`;
    response.data = contact;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
  }

  return response;
}
async function deleteContact(contactId: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    await prisma.contactBook.delete({
      where: {
        id: contactId,
      },
    });

    response.status = 200;
    response.message = "Contact deleted successfully";
    response.data = null;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
  }

  return response;
}
async function toggleFavorite(contactId: string) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const isExists = await prisma.contactBook.findUnique({
      where: {
        id: contactId,
      },
    });

    if (!isExists) {
      response.status = 404;
      response.message = "Contact not found";
      response.data = null;
      return response;
    }

    const favorite = await prisma.contactBook.update({
      where: {
        id: contactId,
      },
      data: {
        favourite: !isExists.favourite,
      },
      select: {
        id: true,
        favourite: true,
      },
    });

    response.status = 200;
    response.message = `Contact ${
      favorite.favourite ? "unmarked" : "marked"
    } as favorite successfully`;
    response.data = favorite;
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
  }

  return response;
}

export const contacts = {
  createContact,
  toggleFavorite,
  deleteContact,
  list,
  listAll,
};
