import { Kafka, Producer, Consumer } from "kafkajs";
import prismaClientForChat from "../prisma/client.js";
import { kafkaConfig } from "./env.constant.js";

const kafka = new Kafka(kafkaConfig as any);

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

let messageBuffer: any[] = [];
const BATCH_SIZE = 10;
const BATCH_INTERVAL = 5000; // 5 seconds

async function saveMessagesToDB(messages: any[]) {
  try {
    const messageDb = await prismaClientForChat.message.createMany({
      data: messages.map(({ senderId, receiverId, message: msg, isGroup }) => ({
        content: msg,
        senderId: senderId,
        recipientId: isGroup ? null : receiverId,
        groupId: isGroup ? receiverId : null,
      })),
    });
  } catch (error) {
    console.error("Error saving messages to DB", error);
  }
}

export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  setInterval(async () => {
    if (messageBuffer.length > 0) {
      const messagesToSave = [...messageBuffer];
      messageBuffer = [];
      await saveMessagesToDB(messagesToSave);
    }
  }, BATCH_INTERVAL);

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message }: any) => {
      if (!message.value) return;
      console.log(`Received message ${message.value}`);
      const parsedMessage = JSON.parse(message.value.toString());
      messageBuffer.push(parsedMessage);

      if (messageBuffer.length >= BATCH_SIZE) {
        const messagesToSave = [...messageBuffer];
        messageBuffer = [];
        await saveMessagesToDB(messagesToSave);
      }
    },
  });
}

export default kafka;
