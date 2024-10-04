// env.constant.ts

// Validate required environment variables
const requiredEnvVars = [
  "REDIS_CONNECTION_URL",
  "KAFKA_BROKER_URL",
  "KAFKA_SASL_USERNAME",
  "KAFKA_SASL_PASSWORD",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Environment variable ${varName} is not set.`);
    process.exit(1);
  }
});

export const REDIS_CONNECTION_URL = process.env.REDIS_CONNECTION_URL;
