// kafka.config.ts
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

// Create Kafka configuration
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
