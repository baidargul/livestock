import { actions } from "@/actions/serverActions/actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const response = {
    status: 500,
    message: "Internal Server Error",
    data: null as any,
  };

  try {
    const data = await req.json();

    const { images } = data;
    const uploads = await actions.server.images.uploadImages(images);
    // Sample Image response
    // Bucket: "murghimandi";
    // ChecksumCRC32: "aFHz3Q==";
    // ETag: '"e28da318df4f95870a086cbf39cf3642"';
    // Key: "44c7d475-f10e-4cc1-a6ed-b4ad05f5fce3-sheep1.png";
    // Location: "https://0e90b5d646de0e6f16996ac1e91a55bb.r2.cloudflarestorage.com/murghimandi/44c7d475-f10e-4cc1-a6ed-b4ad05f5fce3-sheep1.png";
    // VersionId: "7e6963ebbbbd3cddf03e3ab06fb04483";
    // key: "44c7d475-f10e-4cc1-a6ed-b4ad05f5fce3-sheep1.png";

    response.status = 200;
    response.message = "Files uploaded successfully";
    response.data = uploads; // Assuming data contains the uploaded file information
    return new Response(JSON.stringify(response));
  } catch (error: any) {
    console.log("[SERVER ERROR]: " + error.message);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return new Response(JSON.stringify(response));
  }
}
