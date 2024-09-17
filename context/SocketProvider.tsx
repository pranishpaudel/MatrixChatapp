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
  const [updateMessageStatus, setUpdateMessageStatus] = useAtom(
    jotaiAtoms.updateMessageStatus
  );
  const receivedUserId = receiverData?.id;
  const [offlineChats, setOfflineChats] = useAtom(
    jotaiAtoms.offlineChatHistory
  ); // To store chats when receiving user is offline or not connected

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

  const onMessageRec = useCallback(
    (msg: { senderId: string; message: string }) => {
      setUpdateMessageStatus((prevStatus) => !prevStatus);

      setOfflineChats((prevChats) => [
        ...prevChats,
        {
          id: prevChats.length + 1,
          senderUid: senderUserId,
          sender: "other",
          offlineMessage: true,
          receiverUid: receivedUserId,
          message: msg.message,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      console.log("Offline chat history updated");
    },
    [setUpdateMessageStatus, setOfflineChats, receivedUserId, senderUserId]
  );
  useEffect(() => {
    const _socket = io("http://localhost:8000");

    // Register the user ID with the server
    if (senderUserId) {
      _socket.emit("register", senderUserId);
    }

    _socket.on("message", onMessageRec);

    // Error handling
    _socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    _socket.on("disconnect", (reason) => {
      console.warn("Disconnected:", reason);
    });

    socketRef.current = _socket;

    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageRec);
      socketRef.current = null;
    };
  }, [onMessageRec, senderUserId]);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
