import { useAtom } from "jotai";
import React, { useState, useEffect, useRef } from "react";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { Skeleton } from "@/components/ui/skeleton";

interface Chat {
  id: number;
  sender: "user" | "other";
  senderUid?: string;
  receiverUid?: string;
  message: string;
  timestamp: string;
}

interface OfflineChat extends Chat {
  offlineMessage?: boolean;
}

const ChatMessageList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingOnlineChat, setIsLoadingOnlineChat] = useState(false);
  const [offlineChatHistory, setOfflineChatHistory] = useAtom(
    jotaiAtoms.offlineChatHistory
  );
  const [onlineChatHistory, setOnlineChatHistory] = useState<Chat[]>([]);
  const [receiverData] = useAtom(jotaiAtoms.currentChatFriend);
  const [updateMessageStatus, setUpdateMessageStatus] = useAtom(
    jotaiAtoms.updateMessageStatus
  );

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoadingOnlineChat(true);
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
          const onlineChats = data.chatHistory.map((chat: Chat) => ({
            id: chat.id,
            sender: chat.sender,
            senderUid: chat.senderUid,
            offlineMessage: false,
            receiverUid: chat.receiverUid,
            message: chat.message,
            timestamp: chat.timestamp,
          }));

          setOnlineChatHistory(onlineChats);
          setChats(onlineChats);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsLoadingOnlineChat(false);
      }
    };

    fetchChatHistory();
  }, [receiverData]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    if (isLoadingOnlineChat) {
      return;
    }
    const newChatHistory: (Chat | OfflineChat)[] = [
      ...onlineChatHistory.map((chat: any) => ({
        id: chat.id,
        sender: chat.sender,
        message: chat.message,
        timestamp: chat.timestamp,
      })),
      ...offlineChatHistory
        .filter(
          (chat: OfflineChat) =>
            chat.senderUid === receiverData.id ||
            chat.receiverUid === receiverData.id
        )
        .map((chat: OfflineChat) => ({
          id: chat.id,
          sender: chat.sender,
          message: chat.message,
          timestamp: chat.timestamp,
          offlineMessage: chat.offlineMessage,
        })),
    ];

    setChats(newChatHistory);
  }, [
    offlineChatHistory,
    onlineChatHistory,
    isLoadingOnlineChat,
    updateMessageStatus,
    receiverData,
  ]);

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
        {isLoadingOnlineChat ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`flex ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <Skeleton className="h-16 w-3/4 max-w-md" />
              </div>
            ))}
          </div>
        ) : (
          chats.map(renderChat)
        )}
      </div>
    </div>
  );
};

export default ChatMessageList;
