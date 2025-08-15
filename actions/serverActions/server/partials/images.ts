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

async function fetchImages(images: any) {
  const isInDevelopment = process.env.NODE_ENV === "development";
  const baseUrl =
    process.env.IMAGE_BASE_URL ||
    "https://pub-2af91482241043e491600e0712bb4806.r2.dev";

  if (isInDevelopment) {
    console.info(
      "[CLOUDFLARE BYPASS] 💡 Development mode — skipping image fetch"
    );
    return [];
  }

  if (!Array.isArray(images) || images.length === 0) return [];

  try {
    const results = await Promise.all(
      images.map(async (img: any) => {
        const key = typeof img === "string" ? img : img.Key;
        if (!key) return null;

        const imageURL = `${baseUrl}/${key}`;

        try {
          const response = await fetch(imageURL);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          const contentType =
            response.headers.get("Content-Type") || "image/jpeg";
          const buffer = await response.arrayBuffer();

          return {
            name: key,
            image: `data:${contentType};base64,${Buffer.from(buffer).toString(
              "base64"
            )}`,
          };
        } catch (err: any) {
          console.error(`❌ Failed to fetch ${key}:`, err.message);
          return null;
        }
      })
    );

    return results.filter(Boolean);
  } catch (error: any) {
    console.error("@CLOUDFLARE IMAGES:", error.message);
    return [];
  }
}

async function deleteImages(images: any[]) {
  const errors: any[] = [];
  const results: any[] = [];
  const response = {
    status: 500,
    message: "File deletion failed",
    data: null,
  } as any;

  try {
    // Validate environment variable first
    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("R2_BUCKET_NAME environment variable not configured");
    }

    for (const img of images) {
      try {
        // Validate required Key property
        if (!img?.Key) {
          throw new Error("Missing Key property in image object");
        }

        const params = {
          Bucket: bucketName,
          Key: img.Key,
        };

        // Explicitly type the result
        const deleteResult = await r2Client.deleteObject(params).promise();
        console.log("[DELETE SUCCESS]", deleteResult);
        results.push(deleteResult);
      } catch (error: any) {
        console.error(`[DELETE ERROR] Key: ${img.Key}`, error);
        errors.push({
          Key: img.Key,
          error: error.message,
          code: error.code || "DELETE_ERROR",
        });
      }
    }

    // Response handling remains the same
    if (errors.length > 0) {
      response.status = 400;
      response.message = "Some files failed to delete";
      response.data = { successes: results, failures: errors };
    } else {
      response.status = 200;
      response.message = "Files deleted successfully";
      response.data = results;
    }

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
  fetchImages,
  deleteImages,
};
