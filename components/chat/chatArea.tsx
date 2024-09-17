"use client";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Paperclip, Smile, SendHorizontal } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import ChatMessageList from "./chatMessageList";
import { useSocket } from "@/context/SocketProvider";

const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentChatFriend] = useAtom(jotaiAtoms.currentChatFriend);
  const { sendMessage } = useSocket();
  const [, setLastMessageSent] = useAtom(jotaiAtoms.lastMessageReceived);
  const [updateMessageStatus, setUpdateMessageStatus] = useAtom(
    jotaiAtoms.updateMessageStatus
  );
  const onEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setLastMessageSent({
        isSet: true,
        userType: "user",
        message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        senderId: "",
        receiverId: currentChatFriend.id as string,
      });
      setUpdateMessageStatus(!updateMessageStatus);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line in the input field
      handleSendMessage();
    }
  };

  return (
    <>
      {currentChatFriend.isSet ? (
        <div className="ml-2 h-full flex flex-col">
          <div className="flex-grow overflow-hidden">
            <ChatMessageList />
          </div>
          <div id="input" className="mt-4 mb-4 flex justify-center">
            <div className="flex items-center w-[70%] space-x-2">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Enter your message"
                  className="w-full h-[4em] bg-gray-800 text-slate-300 text-lg pr-20"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown} // Handles Enter key
                  enableFocusRing={false}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-slate-300">
                  <Paperclip className="cursor-pointer" />
                  <Smile
                    className="cursor-pointer"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  />
                </div>
                {showEmojiPicker && (
                  <div className="absolute bottom-[4em] right-0">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      theme={Theme.DARK}
                    />
                  </div>
                )}
              </div>
              <button
                className="h-[4em] ml-2 px-4 bg-purple-600 text-white text-lg rounded"
                onClick={handleSendMessage}
              >
                <SendHorizontal className="hover:text-slate-400 h-[100%]" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ChatArea;
