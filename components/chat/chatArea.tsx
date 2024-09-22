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
import { GET_AWS_PRE_SIGNED_URL_FOR_UPLOAD_ROUTE } from "@/constants/routes";

const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentChatFriend] = useAtom(jotaiAtoms.currentChatFriend);
  const [currentGroup] = useAtom(jotaiAtoms.currentGroup);
  const { sendMessage } = useSocket();
  const [offlineChatHistory, setOfflineChatHistory] = useAtom(
    jotaiAtoms.offlineChatHistory
  );
  const [, setOfflineGroupChatLatest] = useAtom(
    jotaiAtoms.offlineGroupChatLatestMessage
  );
  const [updateMessageStatus, setUpdateMessageStatus] = useAtom(
    jotaiAtoms.updateMessageStatus
  );
  const [currentSenderId, setCurrentSenderId] = useAtom(
    jotaiAtoms.currentSenderId
  );
  const [isTyping, setIsTyping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress
  const onEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  useEffect(() => {
    console.log("uploadProgress", uploadProgress);
  }, [uploadProgress]);
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
      if (isGroup) {
        setOfflineGroupChatLatest({
          id: new Date().getTime(), // Unique ID based on timestamp
          sender: "user",
          message,
          timestamp: new Date().toISOString(),
          fromSocket: false,
          groupId: currentGroup.id,
          senderId: currentSenderId,
          senderFirstName: "You",
          senderLastName: "",
          senderImage: "",
        });
      } else {
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
      }

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

  const handleAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    //upload to s3 signed url
    const response = await fetch(GET_AWS_PRE_SIGNED_URL_FOR_UPLOAD_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file?.name,
        fileType: file?.type,
      }),
    });
    console.log(response);

    //put data to response.url
    const data = await response.json();
    const uploadUrl = data.url;
    console.log("upload url ko link", uploadUrl);

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log("File uploaded successfully");
        setUploadProgress(0); // Reset progress after upload
      } else {
        console.error("File upload failed");
      }
    };
    xhr.onerror = () => {
      console.error("File upload error");
    };
    xhr.send(file);
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
                  <label htmlFor="attachmentInput" className="cursor-pointer">
                    <Paperclip />
                  </label>
                  <input
                    id="attachmentInput"
                    type="file"
                    className="hidden"
                    onChange={handleAttachment}
                  />
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
