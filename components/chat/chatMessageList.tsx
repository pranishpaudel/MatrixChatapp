import { useAtom } from "jotai";
import React, { useState, useEffect, useRef } from "react";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { on } from "events";
import { set } from "zod";

interface Chat {
  id: number;
  sender: "user" | "other";
  message: string;
  timestamp: string;
}

interface OfflineChat {
  id: number;
  sender: "user" | "other";
  senderUid?: string;
  message: string;
  timestamp: string;
}

const ChatMessageList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [offlineChatHistory, setOfflineChatHistory] = useAtom(
    jotaiAtoms.offlineChatHistory
  );
  const [onlineChatHistory, setOnlineChatHistory] = useState([]);
  const [receiverData] = useAtom(jotaiAtoms.currentChatFriend);
  const [updateMessageStatus, setUpdateMessageStatus] = useAtom(
    jotaiAtoms.updateMessageStatus
  );

  useEffect(() => {
    const fetchChatHistory = async () => {
      const response = await fetch("/api/getChatHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatFriendUid: receiverData.id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setOnlineChatHistory(data.chatHistory);
        let combinedChatHistory: Chat[] = data.chatHistory.map((chat: any) => ({
          id: chat.id,
          sender: chat.sender,
          message: chat.message,
          timestamp: chat.timestamp,
        }));

        // Filter offlineChatHistory based on senderUid
        const filteredOfflineChats: Chat[] = offlineChatHistory
          .filter((chat: OfflineChat) => chat.senderUid === receiverData.id)
          .map((chat: OfflineChat) => ({
            id: chat.id,
            sender: chat.sender as "user" | "other",
            message: chat.message,
            timestamp: chat.timestamp,
          }));

        combinedChatHistory = [...combinedChatHistory, ...filteredOfflineChats];

        setChats(combinedChatHistory);
      }
    };
    fetchChatHistory();
  }, [receiverData, offlineChatHistory]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);
  useEffect(() => {
    const newChatHistory: Chat[] = [
      ...onlineChatHistory.map((chat: any) => ({
        id: chat.id,
        sender: chat.sender,
        message: chat.message,
        timestamp: chat.timestamp,
      })),
      ...offlineChatHistory.map((chat: OfflineChat) => ({
        id: chat.id,
        sender: chat.sender,
        message: chat.message,
        timestamp: chat.timestamp,
      })),
    ];

    const uniqueChatHistory = newChatHistory.filter(
      (chat, index, self) => index === self.findIndex((c) => c.id === chat.id)
    );

    setChats(uniqueChatHistory);
  }, [offlineChatHistory, onlineChatHistory, updateMessageStatus]);
  const renderChat = (chat: Chat) => {
    const isUser = chat.sender === "user";
    return (
      <div
        key={chat.id}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
          <div
            className={`${
              isUser ? "bg-purple-600" : "bg-[#1E201E]"
            } p-3 rounded-lg ${
              isUser ? "text-gray-200" : "text-white"
            } text-lg`}
          >
            <p>{chat.message}</p>
          </div>
          <div className="text-gray-400 text-sm mt-1">{chat.timestamp}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-4 p-2"
        style={{ maxHeight: "calc(100% - 20px)" }}
      >
        {chats.map(renderChat)}
      </div>
    </div>
  );
};

export default ChatMessageList;
