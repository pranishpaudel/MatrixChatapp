import { Kafka, Producer } from "kafkajs";
import fs from "fs";

const caCert = fs.readFileSync(
  "/Users/air/chatapp/chatServer/src/authCert/ca.pem",
  "utf-8"
);

const kafka = new Kafka({
  brokers: ["kafka-2f1552f-nopecha4-56d1.c.aivencloud.com:14143"],
  ssl: {
    ca: [caCert],
  },
  sasl: {
    username: "avnadmin",
    password: "AVNS_dkxyEppD1gJm4sq3r9b",
    mechanism: "plain",
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

export async function produceMessage(message: object) {
  const producer = await createProducer();
  await producer.send({
    topic: "MESSAGES",
    messages: [
      { key: `message-${Date.now()}`, value: JSON.stringify(message) },
    ],
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
