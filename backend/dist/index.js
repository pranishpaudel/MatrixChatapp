var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { startMessageConsumer } from "./services/kafka.js";
import SocketService from "./services/SocketService.js";
import http from "http";
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        startMessageConsumer();
        const socketService = new SocketService();
        const httpServer = http.createServer();
        const PORT = 8000;
        socketService.io.attach(httpServer);
        socketService.initListeners();
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
}
init();
