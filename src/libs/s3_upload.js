import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from "./s3Client.js";

export const run = async (bucketParams) => {
  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};
