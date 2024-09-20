import React, { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatTimestamp from "@/lib/formatTimestamp";
import TypingEffect from "./TypingEffect";

interface GroupChat {
  id: string | number;
  sender: "user" | "other";
  message: string;
  timestamp: string;
  fromSocket?: boolean;
  groupId?: string;
  senderId: string;
  senderFirstName: string;
  senderLastName: string;
  senderImage: string;
}

const ChatMessageListForGroup: React.FC = () => {
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGroup] = useAtom(jotaiAtoms.currentGroup);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [offlineGroupChatLatest] = useAtom(
    jotaiAtoms.offlineGroupChatLatestMessage
  );
  const [senderUserId] = useAtom(jotaiAtoms.currentSenderId);

  useEffect(() => {
    const fetchGroupChatHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/getChatHistory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatFriendUid: currentGroup.id,
            isGroup: true,
          }),
        });

        const data = await response.json();
        if (data.chatHistory) {
          setGroupChats(data.chatHistory);
        }
      } catch (error) {
        console.error("Failed to fetch group chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupChatHistory();
  }, [currentGroup]);

  useEffect(() => {
    if (offlineGroupChatLatest.groupId === currentGroup.id) {
      setGroupChats((prevChats) => {
        const filteredChats = prevChats.filter(
          (chat) => chat.message !== "!TYPING...!"
        );

        if (
          filteredChats.length === 0 ||
          filteredChats[filteredChats.length - 1].message !==
            offlineGroupChatLatest.message
        ) {
          return [...filteredChats, offlineGroupChatLatest];
        }
        return filteredChats;
      });
    }
  }, [offlineGroupChatLatest, currentGroup.id, senderUserId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [groupChats]);

  const renderGroupChat = (chat: GroupChat) => {
    const isUser = chat.sender === "user";
    const showTypingEffect =
      chat.message === "!TYPING...!" &&
      chat.sender !== "user" &&
      chat.senderId !== senderUserId;

    if (chat.message === "!TYPING...!" && chat.senderId === senderUserId) {
      return null;
    }

    return (
      <div
        key={chat.id}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <Avatar className="mr-2">
            <AvatarImage
              src={chat.senderImage}
              alt={`${chat.senderFirstName} ${chat.senderLastName}`}
            />
            <AvatarFallback>
              {chat.senderFirstName[0]}
              {chat.senderLastName[0]}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="relative bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
          <div
            className={`p-3 rounded-lg ${
              isUser ? "bg-purple-600 text-gray-200" : "bg-[#1E201E] text-white"
            } text-lg break-words`}
          >
            {showTypingEffect ? <TypingEffect /> : <p>{chat.message}</p>}
          </div>
          <div className="text-gray-400 text-sm mt-1">
            {formatTimestamp(chat.timestamp)}
          </div>
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
        {isLoading ? <div>Loading...</div> : groupChats.map(renderGroupChat)}
      </div>
    </div>
  );
};

export default ChatMessageListForGroup;
