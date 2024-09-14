"use client";
import React, { useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";
interface SocketProviderProp {
  children?: React.ReactNode;
}
interface ISocketContext {
  sendMessage: (msg: string) => void;
}
const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
export const SocketProvider: React.FC<SocketProviderProp> = ({ children }) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      socket?.emit("event:message", { message: msg });
    },
    [socket]
  );
  const onMessageRec = useCallback((msg: string) => {
    console.log("Received message", msg);
  }, []);
  useEffect(() => {
    console.log("SocketProvider useEffect");
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMessageRec);
    setSocket(_socket);
    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageRec);
      setSocket(null);
    };
  }, [onMessageRec]);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
