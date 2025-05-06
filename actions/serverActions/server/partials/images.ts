import r2Client from "@/helpers/cloudflare/R2Client";
import { base64ToBlob, ImagePayload } from "@/lib/image";
import { v4 as uuvid } from "uuid";

async function uploadImages(images: ImagePayload[]) {
  const errors: any[] = [];
  const results: any[] = [];

  const response = {
    status: 500,
    message: "File upload failed",
    data: null,
  } as any;

  try {
    for (const img of images) {
      try {
        const image = base64ToBlob(img.base64, img.extension);
        // 1. Convert File to ArrayBuffer
        const fileBuffer = await image.arrayBuffer();

        // 2. Prepare upload params (fixed Key typo)
        const params: any = {
          Bucket: process.env.R2_BUCKET_NAME,
          Key: `${uuvid()}-${img.fileName}`, // removed extra `}`
          Body: Buffer.from(fileBuffer),
          ContentType: image.type || "image/jpeg",
          ACL: "public-read",
        };

        // 3. Upload to R2
        const uploadResult = await r2Client.upload(params).promise();
        console.log("[UPLOAD SUCCESS]", uploadResult);
        results.push(uploadResult);
      } catch (error: any) {
        // Log full error for debugging
        console.error(`[UPLOAD ERROR] file: ${img.fileName}`, error);
        errors.push({ fileName: img.fileName, error: error.message });
      }
    }

    // 4. Final response based on errors
    if (errors.length > 0) {
      response.status = 400;
      response.message = "Some files failed to upload";
      response.data = { successes: results, failures: errors };
      return response;
    }

    response.status = errors.length === 0 ? 200 : 400;
    response.message = "Files uploaded successfully";
    response.data = results;
    return response;
  } catch (error: any) {
    console.error("[SERVER ERROR]", error);
    response.status = 500;
    response.message = error.message;
    response.data = null;
    return response;
  }
}

export const images = {
  uploadImages,
};
