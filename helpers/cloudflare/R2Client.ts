import AWS from "aws-sdk";

const r2Client = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  region: process.env.R2_REGION,
  s3ForcePathStyle: true, // Cloudflare R2 requires path-style URLs
});

export default r2Client;
