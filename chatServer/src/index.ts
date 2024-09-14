import SocketService from "./services/SocketService.js";
import http from "http";
async function init() {
  const socketService = new SocketService();
  const httpServer = http.createServer();
  const PORT = 8000;
  socketService.io.attach(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
init();
