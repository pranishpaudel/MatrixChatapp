import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import client from "./awsClientProvider";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

export const createS3FolderInBucket = async (folderUUID: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: `${folderUUID}/`, // Add trailing slash to simulate a folder
  });
  return await client.send(command);
};

export async function putObject(
  filename: string,
  contentType: string,
  userId: string,
  expirationSeconds: number
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${userId}/${filename}`,
    ContentType: contentType,
  });
  const url = await getSignedUrl(client, command, {
    expiresIn: expirationSeconds as number,
  });
  return url;
}

export async function getObject(
  filename: string,
  userId: string,
  expirationSeconds: number,
  actionType: "open" | "download"
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${userId}/${filename}`,
    ResponseContentDisposition:
      actionType === "download"
        ? `attachment; filename="${filename}"`
        : undefined,
  });
  const url = await getSignedUrl(client, command, {
    expiresIn: expirationSeconds as number,
  });
  return url;
}
