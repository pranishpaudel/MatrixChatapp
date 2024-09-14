import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("SocketService constructor");
    this._io = new Server();
  }

  public initListeners() {
    console.log("SocketService initListeners");
    this._io.on("connection", (socket) => {
      console.log("New client connected", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New message received", message);
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
