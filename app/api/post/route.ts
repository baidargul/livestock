import prisma from "@/lib/prisma";
import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

async function POST(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();

    const { images } = data;
    const uploads = await actions.server.images.uploadImages(images);
    if (uploads.status === 400) {
      response.status = 400;
      response.message = `Unable to upload images`;
      response.data = uploads.data;
      return new Response(JSON.stringify(response));
    }

    data.images = uploads.data;

    const raw = {
      ...data,
      averageAge: Number(data.averageAge) ?? 0,
      averageWeight: Number(data.averageWeight) ?? 0,
      maleQuantityAvailable: Number(data.maleQuantityAvailable) ?? 0,
      femaleQuantityAvailable: Number(data.femaleQuantityAvailable) ?? 0,
      price: Number(data.price) ?? 0,
    };

    const animal = await prisma.animal.create({
      data: raw,
    });

    // Sample Image response
    // Bucket: "murghimandi";
    // ChecksumCRC32: "aFHz3Q==";
    // ETag: '"e28da318df4f95870a086cbf39cf3642"';
    // Key: "44c7d475-f10e-4cc1-a6ed-b4ad05f5fce3-sheep1.png";
    // Location: "https://0e90b5d646de0e6f16996ac1e91a55bb.r2.cloudflarestorage.com/murghimandi/44c7d475-f10e-4cc1-a6ed-b4ad05f5fce3-sheep1.png";
    // VersionId: "7e6963ebbbbd3cddf03e3ab06fb04483";
    // key: "44c7d475-f10e-4cc1-a6ed-b4ad05f5fce3-sheep1.png";

    response.status = 200;
    response.message = "Animal created successfully";
    response.data = animal; // Assuming data contains the uploaded file information
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
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const id = new URL(req.url).searchParams.get("id");

    if (!id) {
      response.status = 400;
      response.message = `Post not found`;
      response.data = null;
      return new Response(JSON.stringify(response));
    }

    const deletedPost = await prisma.animal.delete({
      where: { id },
    });
    response.status = 200;
    response.message = "Post deleted successfully";
    response.data = deletedPost;
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
