import { Server } from "socket.io";
import Redis from "ioredis";

// Connect to Redis
const serviceUri =
  "rediss://default:AVNS_bZyrZ7T9-2PsZX49E8H@caching-972a5c3-sindsa26-d146.l.aivencloud.com:10664";
const pub = new Redis(serviceUri);
const sub = new Redis(serviceUri);
// Error handling for Redis connections
pub.on("error", (err) => {
  console.error("Redis pub error:", err);
});

sub.on("error", (err) => {
  console.error("Redis sub error:", err);
});

// Subscribe to the "MESSAGES" channel
sub.subscribe("MESSAGES");

// Listen for messages on the "MESSAGES" channel

class SocketService {
  private _io: Server;

  constructor() {
    console.log("SocketService constructor");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.on("message", (channel, message) => {
      this._io.emit("event:message", JSON.parse(message));
    });
  }

  public initListeners() {
    console.log("SocketService initListeners");
    this._io.on("connection", (socket) => {
      console.log("New client connected", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New message received", message);
        try {
          const result = await pub.publish(
            "MESSAGES",
            JSON.stringify({ message })
          );
          console.log("Message published to Redis", result);
        } catch (err) {
          console.error("Failed to publish message:", err);
        }
      });
      sub.on("message", (channel, message) => {
        if (channel === "MESSAGES") {
          console.log(`Received message from ${channel}: ${message}`);
          this._io.emit("message", JSON.parse(message));
        }
      });
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
