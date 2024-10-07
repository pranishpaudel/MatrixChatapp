import { startMessageConsumer } from "./services/kafka.js";
import SocketService from "./services/SocketService.js";
import http from "http";

async function init() {
  startMessageConsumer();
  const socketService = new SocketService();
  const httpServer = http.createServer();
  const PORT = 8000;
  socketService.io.attach(httpServer);
  socketService.initListeners();
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
init();
