import React, { useState, useEffect, useRef } from "react";

interface Chat {
  id: number;
  sender: "user" | "other";
  message: string;
  timestamp: string;
}

const ChatMessageList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dummyChats: Chat[] = [
      {
        id: 1,
        sender: "user",
        message: "Hey there! How are you?",
        timestamp: "10:15 AM",
      },
      {
        id: 2,
        sender: "other",
        message: "I am good, thanks! What about you?",
        timestamp: "10:16 AM",
      },
      {
        id: 3,
        sender: "user",
        message: "I'm doing well too, thanks for asking!",
        timestamp: "10:17 AM",
      },
      {
        id: 4,
        sender: "other",
        message: "I am good, thanks! What about you?",
        timestamp: "10:16 AM",
      },
      {
        id: 5,
        sender: "user",
        message: "I'm doing well too, thanks for asking!",
        timestamp: "10:17 AM",
      },
      {
        id: 6,
        sender: "user",
        message: "I'm doing well too, thanks for asking!",
        timestamp: "10:17 AM",
      },
      {
        id: 7,
        sender: "other",
        message: "I am good, thanks! What about you?",
        timestamp: "10:16 AM",
      },
      {
        id: 8,
        sender: "user",
        message: "I'm doing well too, thanks for asking!",
        timestamp: "10:17 AM",
      },
      // ... other dummy chats ...
    ];

    setChats(dummyChats);
  }, []);

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
