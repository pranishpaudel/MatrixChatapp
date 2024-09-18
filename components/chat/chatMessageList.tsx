import { useAtom } from "jotai";
import React, { useState, useEffect, useRef } from "react";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { Skeleton } from "@/components/ui/skeleton";
import formatTimestamp from "@/lib/formatTimestamp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TypingEffect from "./TypingEffect";

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
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingOnlineChat, setIsLoadingOnlineChat] = useState(false);
  const [offlineChatHistory, setOfflineChatHistory] = useAtom(
    jotaiAtoms.offlineChatHistory
  );
  const [onlineChatHistory, setOnlineChatHistory] = useState<{
    [key: string]: Chat[];
  }>({});
  const [receiverData] = useAtom(jotaiAtoms.currentChatFriend);
  const [updateMessageStatus, setUpdateMessageStatus] = useAtom(
    jotaiAtoms.updateMessageStatus
  );
  const [chatFriendsUidCacheHistory, setChatFriendsUidCacheHistory] = useAtom(
    jotaiAtoms.chatFriendsUidCacheHistory
  );

  useEffect(() => {
    const fetchChatHistory = async () => {
      // Check if the chat history is already fetched
      if (chatFriendsUidCacheHistory.includes(receiverData.id)) {
        setChats(onlineChatHistory[receiverData.id] || []);
        return;
      }
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

          setOnlineChatHistory((prev) => ({
            ...prev,
            [receiverData.id]: onlineChats,
          }));
          setChats(onlineChats);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsLoadingOnlineChat(false);
        setChatFriendsUidCacheHistory((prev) => {
          if (!prev.includes(receiverData.id)) {
            return [...prev, receiverData.id];
          }
          return prev;
        });
      }
    };

    fetchChatHistory();
  }, [
    receiverData,
    setChatFriendsUidCacheHistory,
    onlineChatHistory,
    chatFriendsUidCacheHistory,
  ]);

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
      ...(onlineChatHistory[receiverData.id] || []).map((chat: any) => ({
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
    ].filter((chat) => chat.message !== "!TYPING...!");

    setChats(newChatHistory);
  }, [
    offlineChatHistory,
    onlineChatHistory,
    isLoadingOnlineChat,
    updateMessageStatus,
    receiverData,
  ]);

  useEffect(() => {
    if (offlineChatHistory.length > 0) {
      const lastMessage = offlineChatHistory[offlineChatHistory.length - 1];
      setIsTyping(lastMessage.message === "!TYPING...!");
    } else {
      setIsTyping(false);
    }
  }, [offlineChatHistory]);

  const renderChat = (chat: Chat) => {
    const isUser = chat.sender === "user";
    return (
      <div
        key={chat.id}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <Avatar className="mr-2">
            <AvatarImage
              src={
                receiverData.image
                  ? receiverData.image
                  : "https://github.com/shadcn.png"
              }
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
        <div className="relative bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
          <div
            className={`${
              isUser ? "bg-purple-600" : "bg-[#1E201E]"
            } p-3 rounded-lg ${
              isUser ? "text-gray-200" : "text-white"
            } text-lg`}
          >
            <p>{chat.message}</p>
          </div>
          <div className="text-gray-400 text-sm mt-1">
            {formatTimestamp(chat.timestamp)}
          </div>
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              isUser ? "right-full mr-2" : "left-full ml-2"
            }`}
          >
            <div
              className={`w-0 h-0 border-t-8 border-b-8 ${
                isUser
                  ? "border-l-8 border-l-purple-600"
                  : "border-r-8 border-r-[#1E201E]"
              } border-transparent`}
            ></div>
          </div>
        </div>
        {isUser && (
          <Avatar className="ml-2">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
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
          <>
            {chats.map(renderChat)}
            {isTyping && (
              <div className="flex justify-start">
                <Avatar className="mr-2">
                  <AvatarImage
                    src={
                      receiverData.image
                        ? receiverData.image
                        : "https://github.com/shadcn.png"
                    }
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="relative bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
                  <div className="bg-[#1E201E] p-3 rounded-lg text-white text-lg">
                    <p>
                      <TypingEffect />
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessageList;
