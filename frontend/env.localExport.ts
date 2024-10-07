// THIS FILE SENDS ENVIRONMENT VARIABLES TO ALL FILES

const localEnv = {
  POSTGRESQL_DATABASE_ENDPOINT: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  AWS_REGION_ID: process.env.S3AWS_REGION_ID,
  AWS_BUCKET_NAME: process.env.S3AWS_BUCKET_NAME,
  AWS_ACCESS_KEY: process.env.S3AWS_ACCESS_KEY,
  AWS_ACCESS_SECRET: process.env.S3AWS_ACCESS_SECRET,
  REDIS_DATABASE_ENDPOINT: process.env.REDIS_URL,
  CHAT_SERVER_ENDPOINT: process.env.CHATSERVER_URL,
};

// Function to validate environment variables
function validateEnvVariables(env: any) {
  const missingVars = [];
  for (const [key, value] of Object.entries(env)) {
    if (!value) {
      missingVars.push(key);
    }
  }
  if (missingVars.length > 0) {
    const errorMessage = `Missing environment variables: ${missingVars.join(
      ", "
    )}`;
    console.error(errorMessage);
    throw new Error(errorMessage); 
  }
}

// Validate the environment variables
validateEnvVariables(localEnv);

export default localEnv;
