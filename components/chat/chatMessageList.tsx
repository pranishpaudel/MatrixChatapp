import { useAtom } from "jotai";
import React, { useState, useEffect, useRef } from "react";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";

interface Chat {
  id: number;
  sender: "user" | "other";
  message: string;
  timestamp: string;
}

const ChatMessageList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [updateMessageStatus] = useAtom(jotaiAtoms.updateMessageStatus);
  const [lastMessageReceived, setLastMessageReceived] = useAtom(
    jotaiAtoms.lastMessageReceived
  );
  const [receiverData] = useAtom(jotaiAtoms.currentChatFriend);

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
        setChats(data.chatHistory);
      }
    };
    fetchChatHistory();
  }, [receiverData]);

  useEffect(() => {
    setChats((prevChats) => [
      ...prevChats,
      {
        id: prevChats.length + 1,
        sender: lastMessageReceived.userType as "user" | "other",
        message: lastMessageReceived.message,
        timestamp: lastMessageReceived.timestamp,
      },
    ]);

    console.log("New message received", lastMessageReceived);
  }, [updateMessageStatus, lastMessageReceived, setLastMessageReceived]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

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
