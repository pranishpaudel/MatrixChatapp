var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Server } from "socket.io";
import Redis from "ioredis";
import { produceMessage } from "./kafka.js";
import { REDIS_CONNECTION_URL } from "../appConfig/env.constant.js";
const serviceUri = REDIS_CONNECTION_URL;
const pub = new Redis(serviceUri);
const sub = new Redis(serviceUri);
pub.on("error", (err) => {
    console.error("Redis pub error:", err);
});
sub.on("error", (err) => {
    console.error("Redis sub error:", err);
});
sub.subscribe("MESSAGES");
class SocketService {
    constructor() {
        this.users = {}; // Map to store userId to socketId
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            },
        });
        // Single listener for Redis messages
        sub.on("message", (channel, message) => __awaiter(this, void 0, void 0, function* () {
            if (channel === "MESSAGES") {
                const parsedMessage = JSON.parse(message);
                const { senderId, receiverId, message: msg, isGroup } = parsedMessage;
                if (msg !== "!TYPING...!") {
                    yield produceMessage(parsedMessage);
                }
                if (isGroup) {
                    // Emit the message to all members of the group
                    this._io.to(receiverId).emit("message", {
                        senderId,
                        receiverId,
                        isGroup: true,
                        message: msg,
                    });
                }
                else {
                    // Emit the message to the specific receiver
                    const receiverSocketId = this.users[receiverId];
                    if (receiverSocketId) {
                        this._io.to(receiverSocketId).emit("message", {
                            senderId,
                            receiverId,
                            isGroup: false,
                            message: msg,
                        });
                    }
                }
            }
        }));
    }
    initListeners() {
        this._io.on("connection", (socket) => {
            // Listen for user registration to map userId to socketId
            socket.on("register", (userId, isGroup, groupId) => __awaiter(this, void 0, void 0, function* () {
                this.users[userId] = socket.id;
                console.log(`User ${userId} registered with socket ID ${socket.id}`);
                if (isGroup && groupId) {
                    // Join the socket to the group room
                    socket.join(groupId);
                    console.log(`User ${userId} joined group ${groupId}`);
                }
            }));
            socket.on("event:message", (_a) => __awaiter(this, [_a], void 0, function* ({ message, senderId, isGroup, receiverId, }) {
                try {
                    const result = yield pub.publish("MESSAGES", JSON.stringify({ senderId, receiverId, message, isGroup }));
                }
                catch (err) {
                    console.error("Failed to publish message:", err);
                }
            }));
            socket.on("disconnect", () => {
                console.log("Client disconnected", socket.id);
                // Remove the user from the mapping
                for (const userId in this.users) {
                    if (this.users[userId] === socket.id) {
                        delete this.users[userId];
                        console.log(`User ${userId} disconnected and removed from mapping`);
                        break;
                    }
                }
            });
        });
    }
    get io() {
        return this._io;
    }
}
export default SocketService;
