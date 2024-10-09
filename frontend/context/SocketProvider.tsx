"use client";
import refreshText from "@/constants/refreshText";
import localEnv from "@/env.localExport";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProp {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string, senderId?: string, receiverId?: string) => void;
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
  const [currentGroup] = useAtom(jotaiAtoms.currentGroup);
  const [, setOfflineGroupChatLatest] = useAtom(
    jotaiAtoms.offlineGroupChatLatestMessage
  );
  const [groupMembers, setGroupMembers] = useAtom(jotaiAtoms.groupMembers);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg, manualSenderId?: string, manualReceiverId?: string) => {
      if (socketRef.current) {
        const isManual = manualSenderId && manualReceiverId;
        socketRef.current.emit("event:message", {
          message: msg,
          senderId: isManual ? manualSenderId : senderUserId,
          isGroup: isManual ? false : currentGroup?.isSet,
          receiverId: isManual
            ? manualReceiverId
            : currentGroup?.isSet
            ? currentGroup.id
            : receivedUserId,
        });
      }
    },
    [senderUserId, receivedUserId, currentGroup] // Correct dependencies
  );

  const onMessageRec = useCallback(
    (msg: {
      senderId: string;
      receiverId: string;
      isGroup: boolean;
      message: string;
    }) => {
      if (msg.message === refreshText) {
        //refresh page
        location.reload();
      }
      setUpdateMessageStatus((prevStatus) => !prevStatus);

      const senderDetails = groupMembers.find(
        (member) => member.id === msg.senderId
      );

      if (msg.isGroup) {
        setOfflineGroupChatLatest({
          id: new Date().getTime(), // Unique ID based on timestamp
          sender: "other",
          message: msg.message,
          timestamp: new Date().toISOString(),
          fromSocket: true,
          groupId: msg.receiverId,
          senderId: msg.senderId,
          senderFirstName: senderDetails?.firstName || "Unknown", // Replace with actual data
          senderLastName: senderDetails?.lastName || "Unknown", // Replace with actual data
          senderImage: senderDetails?.image || "ImageURL", // Replace with actual data
        });
      } else {
        setOfflineChats((prevChats) => {
          // Check if the last message is "!TYPING...!"
          const lastMessage = prevChats[prevChats.length - 1];
          if (
            msg.message === "!TYPING...!" &&
            lastMessage?.message === "!TYPING...!"
          ) {
            return prevChats; // Do not add the typing message again
          }

          return [
            ...prevChats,
            (() => {
              return {
                id: prevChats.length + 1,
                senderUid: msg.senderId,
                sender: "other",
                offlineMessage: true,
                isRead: false,
                isGroup: msg.isGroup,
                receiverUid: msg.receiverId,
                message: msg.message,
                timestamp: new Date().toISOString(),
              };
            })(),
          ];
        });
      }
    },
    [
      setUpdateMessageStatus,
      setOfflineChats,
      setOfflineGroupChatLatest,
      groupMembers,
    ]
  );

  useEffect(() => {
    const _socket = io(
      localEnv.CHAT_SERVER_ENDPOINT
        ? localEnv.CHAT_SERVER_ENDPOINT
        : "http://localhost:8000"
    );
    console.log(localEnv.CHAT_SERVER_ENDPOINT, "Yo ho info");
    // Register the user ID with the server
    if (senderUserId) {
      _socket.emit(
        "register",
        senderUserId,
        currentGroup?.isSet,
        currentGroup?.id
      );
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
  }, [onMessageRec, senderUserId, currentGroup]);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
