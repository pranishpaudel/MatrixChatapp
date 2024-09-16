"use client";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useRef } from "react";
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
  const socketRef = useRef<Socket | null>(null);
  const [receiverData] = useAtom(jotaiAtoms.currentChatFriend);
  const [senderUserId] = useAtom(jotaiAtoms.currentSenderId);
  const receivedUserId = receiverData?.id;

  console.log("receivedUserId", receivedUserId);
  console.log("senderUserId", senderUserId);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      if (socketRef.current) {
        socketRef.current.emit("event:message", {
          message: msg,
          senderId: senderUserId,
          receiverId: receivedUserId,
        });
      }
    },
    [senderUserId, receivedUserId]
  );

  const onMessageRec = useCallback((msg: string) => {
    console.log("Received message", msg);
  }, []);

  useEffect(() => {
    console.log("SocketProvider useEffect");
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMessageRec);
    socketRef.current = _socket;

    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageRec);
      socketRef.current = null;
    };
  }, [onMessageRec]);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
