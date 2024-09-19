"use client";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Paperclip, Smile, SendHorizontal } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import ChatMessageList from "./chatMessageList";
import { useSocket } from "@/context/SocketProvider";
import ChatMessageListForGroup from "./chatMessageListForGroup";

const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentChatFriend] = useAtom(jotaiAtoms.currentChatFriend);
  const [currentGroup] = useAtom(jotaiAtoms.currentGroup);
  const { sendMessage } = useSocket();
  const [offlineChatHistory, setOfflineChatHistory] = useAtom(
    jotaiAtoms.offlineChatHistory
  );
  const [updateMessageStatus, setUpdateMessageStatus] = useAtom(
    jotaiAtoms.updateMessageStatus
  );
  const [currentSenderId, setCurrentSenderId] = useAtom(
    jotaiAtoms.currentSenderId
  );
  const [isTyping, setIsTyping] = useState(false);

  const onEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleSendMessage = () => {
    const isGroup = currentGroup.isSet;
    console.log(
      "currentGroup ko kura",
      isGroup,
      "sathy ko kura",
      currentChatFriend.isSet
    );
    if (message.trim()) {
      sendMessage(message);
      setOfflineChatHistory((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "user",
          senderUid: currentSenderId,
          offlineMessage: false,
          isRead: false,
          isGroup,
          receiverUid: currentChatFriend.id,
          message,
          timestamp: new Date().toISOString(),
        },
      ]);
      setUpdateMessageStatus((prevStatus) => !prevStatus);
      setMessage("");
      setIsTyping(false); // Reset typing status after sending message
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line in the input field
      handleSendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      sendMessage("!TYPING...!");
    }
  };

  useEffect(() => {
    if (isTyping) {
      const typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000); // Reset typing status after 3 seconds of inactivity

      return () => clearTimeout(typingTimeout);
    }
  }, [isTyping]);

  return (
    <>
      {currentChatFriend.isSet || currentGroup.isSet ? (
        <div className="ml-2 h-full flex flex-col">
          <div className="flex-grow overflow-hidden">
            {!currentGroup.isSet ? (
              <ChatMessageList />
            ) : (
              <ChatMessageListForGroup />
            )}
          </div>
          <div id="input" className="mt-4 mb-4 flex justify-center">
            <div className="flex items-center w-[70%] space-x-2">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Enter your message"
                  className="w-full h-[4em] bg-gray-800 text-slate-300 text-lg pr-20"
                  value={message}
                  onChange={handleTyping} // Handles typing status
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
