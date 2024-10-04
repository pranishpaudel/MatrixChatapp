import { Server } from "socket.io";
import Redis from "ioredis";
import { produceMessage } from "./kafka.js";
import { getGroupMembers } from "./database.js"; // Assume this function queries the DB for group members
import { REDIS_CONNECTION_URL } from "./env.constant.js";

interface iMessageFromFrontend {
  message: string;
  senderId: string;
  isGroup: boolean;
  receiverId: string;
}

const serviceUri = REDIS_CONNECTION_URL as string;
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
  private _io: Server;
  private users: { [key: string]: string } = {}; // Map to store userId to socketId

  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    // Single listener for Redis messages
    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        const parsedMessage = JSON.parse(message);
        const { senderId, receiverId, message: msg, isGroup } = parsedMessage;

        if (msg !== "!TYPING...!") {
          await produceMessage(parsedMessage);
        }

        if (isGroup) {
          // Emit the message to all members of the group
          this._io.to(receiverId).emit("message", {
            senderId,
            receiverId,
            isGroup: true,
            message: msg,
          });
        } else {
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
    });
  }

  public initListeners() {
    this._io.on("connection", (socket) => {
      // Listen for user registration to map userId to socketId
      socket.on(
        "register",
        async (userId: string, isGroup: boolean, groupId?: string) => {
          this.users[userId] = socket.id;
          console.log(`User ${userId} registered with socket ID ${socket.id}`);

          if (isGroup && groupId) {
            // Join the socket to the group room
            socket.join(groupId);
            console.log(`User ${userId} joined group ${groupId}`);
          }
        }
      );

      socket.on(
        "event:message",
        async ({
          message,
          senderId,
          isGroup,
          receiverId,
        }: iMessageFromFrontend) => {
         
          try {
            const result = await pub.publish(
              "MESSAGES",
              JSON.stringify({ senderId, receiverId, message, isGroup })
            );
          } catch (err) {
            console.error("Failed to publish message:", err);
          }
        }
      );

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
