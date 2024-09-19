import { Server } from "socket.io";
import Redis from "ioredis";
import { produceMessage } from "./kafka.js";
import { getGroupMembers } from "./database.js"; // Assume this function queries the DB for group members

interface iMessageFromFrontend {
  message: string;
  senderId: string;
  isGroup: boolean;
  receiverId: string;
}

const serviceUri =
  "rediss://default:AVNS_bZyrZ7T9-2PsZX49E8H@caching-972a5c3-sindsa26-d146.l.aivencloud.com:10664";
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
  private groups: { [key: string]: string[] } = {}; // Map to store groupId to userIds

  constructor() {
    console.log("SocketService constructor");
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

        // if (msg !== "!TYPING...!") {
        //   await produceMessage(parsedMessage);
        // }
        console.log("Message Produced to Kafka Broker");

        if (isGroup) {
          console.log("Group id", receiverId);
          // Emit the message to all members of the group
          const groupMembers = await getGroupMembers(receiverId);
          console.log("Group members", groupMembers);
          groupMembers.forEach((memberId: string) => {
            const memberSocketId = this.users[memberId];
            if (memberSocketId) {
              this._io
                .to(memberSocketId)
                .emit("message", { senderId, receiverId, message: msg });
            }
          });
        } else {
          // Emit the message to the specific receiver
          const receiverSocketId = this.users[receiverId];
          if (receiverSocketId) {
            this._io
              .to(receiverSocketId)
              .emit("message", { senderId, receiverId, message: msg });
          }
        }
      }
    });
  }

  public initListeners() {
    console.log("SocketService initListeners");
    this._io.on("connection", (socket) => {
      console.log("New client connected", socket.id);

      // Listen for user registration to map userId to socketId
      socket.on(
        "register",
        (userId: string, isGroup: boolean, groupId?: string) => {
          this.users[userId] = socket.id;
          console.log(`User ${userId} registered with socket ID ${socket.id}`);
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
          if (isGroup) {
            console.log("Group message received");
          }
          try {
            const result = await pub.publish(
              "MESSAGES",
              JSON.stringify({ senderId, receiverId, message, isGroup })
            );
            console.log("Message published to Redis", result);
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
