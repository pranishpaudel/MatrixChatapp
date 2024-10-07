var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Kafka } from "kafkajs";
import prismaClientForChat from "../prisma/client.js";
import { kafkaConfig } from "../appConfig/kafka.config.js";
const kafka = new Kafka(kafkaConfig);
let producer = null;
export function createProducer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (producer)
            return producer;
        const _producer = kafka.producer();
        yield _producer.connect();
        producer = _producer;
        return producer;
    });
}
export function produceMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = yield createProducer();
        yield producer.send({
            topic: "MESSAGES",
            messages: [
                { key: `message-${Date.now()}`, value: JSON.stringify(message) },
            ],
        });
        return true;
    });
}
let messageBuffer = [];
const BATCH_SIZE = 10;
const BATCH_INTERVAL = 5000; // 5 seconds
function saveMessagesToDB(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const messageDb = yield prismaClientForChat.message.createMany({
                data: messages.map(({ senderId, receiverId, message: msg, isGroup }) => ({
                    content: msg,
                    senderId: senderId,
                    recipientId: isGroup ? null : receiverId,
                    groupId: isGroup ? receiverId : null,
                })),
            });
        }
        catch (error) {
            console.error("Error saving messages to DB", error);
        }
    });
}
export function startMessageConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: "default" });
        yield consumer.connect();
        yield consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (messageBuffer.length > 0) {
                const messagesToSave = [...messageBuffer];
                messageBuffer = [];
                yield saveMessagesToDB(messagesToSave);
            }
        }), BATCH_INTERVAL);
        yield consumer.run({
            autoCommit: true,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ message }) {
                if (!message.value)
                    return;
                console.log(`Received message ${message.value}`);
                const parsedMessage = JSON.parse(message.value.toString());
                messageBuffer.push(parsedMessage);
                if (messageBuffer.length >= BATCH_SIZE) {
                    const messagesToSave = [...messageBuffer];
                    messageBuffer = [];
                    yield saveMessagesToDB(messagesToSave);
                }
            }),
        });
    });
}
export default kafka;
