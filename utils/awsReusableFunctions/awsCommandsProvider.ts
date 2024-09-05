import { PutObjectCommand } from "@aws-sdk/client-s3";
import client from "./awsClientProvider";

export const createS3FolderInBucket = async (folderUUID: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: `${folderUUID}/`, // Add trailing slash to simulate a folder
  });
  return await client.send(command);
};
