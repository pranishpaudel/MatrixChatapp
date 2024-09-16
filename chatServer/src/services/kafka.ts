import { Kafka, Producer } from "kafkajs";
import fs from "fs";
const clientCert = fs.readFileSync(
  "/Users/air/chatapp/chatServer/src/authCert/service.cert",
  "utf-8"
);
const clientKey = fs.readFileSync(
  "/Users/air/chatapp/chatServer/src/authCert/service.key",
  "utf-8"
);
const caCert = fs.readFileSync(
  "/Users/air/chatapp/chatServer/src/authCert/ca.pem",
  "utf-8"
);

const kafka = new Kafka({
  brokers: ["kafka-2f1552f-nopecha4-56d1.c.aivencloud.com:14132"],
  ssl: {
    rejectUnauthorized: true, // This is the default value
    ca: [caCert],
    key: clientKey,
    cert: clientCert,
  },
});

let producer: null | Producer = null;
export async function createProducer() {
  if (producer) return producer;
  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}
export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    topic: "MESSAGES",
    messages: [{ key: `message-${Date.now()}`, value: message }],
  });
  return true;
}

export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log(`Received message ${message.value}`);
      pause();
    },
  });
}
export default kafka;
