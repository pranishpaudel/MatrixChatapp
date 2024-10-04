import * as fs from "fs";
import * as path from "path";

// Construct the path to the ca.pem file relative to this file
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const kafkaCACertPath = path.join(__dirname, "../authCert/ca.pem");

// Read the Kafka CA certificate with error handling
let kafkaCACert: string;
try {
  kafkaCACert = fs.readFileSync(kafkaCACertPath, "utf-8");
} catch (error: any) {
  console.error(`Failed to read Kafka CA certificate: ${error.message}`);
  process.exit(1);
}

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
export const kafkaConfig = {
  brokers: [process.env.KAFKA_BROKER_URL as string],
  ssl: {
    ca: [kafkaCACert],
  },
  sasl: {
    username: process.env.KAFKA_SASL_USERNAME as string,
    password: process.env.KAFKA_SASL_PASSWORD as string,
    mechanism: "plain",
  },
};
