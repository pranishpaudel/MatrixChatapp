import localEnv from "@/env.localExport";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: localEnv.AWS_REGION_ID as string,
  credentials: {
    accessKeyId: localEnv.AWS_ACCESS_KEY as string,
    secretAccessKey: localEnv.AWS_ACCESS_SECRET as string,
  },
});

export default client;
