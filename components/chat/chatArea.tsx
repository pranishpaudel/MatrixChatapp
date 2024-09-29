"use client";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Paperclip, Smile, SendHorizontal, CheckCircle } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import ChatMessageList from "./chatMessageList";
import { useSocket } from "@/context/SocketProvider";
import ChatMessageListForGroup from "./chatMessageListForGroup";
import {
  GET_AWS_PRE_SIGNED_URL_FOR_DOWNLOAD_ROUTE,
  GET_AWS_PRE_SIGNED_URL_FOR_UPLOAD_ROUTE,
} from "@/constants/routes";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import textGenerateEffectWords from "@/constants/chatAreaConstant";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "uploading" | "completed" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  useEffect(() => {
    console.log("uploadProgress", uploadProgress);
    console.log("uploadedFileUrl ko aaileko", uploadedFileUrl);
  }, [uploadProgress, uploadedFileUrl]);

  const handleSendMessage = () => {
    const isGroup = currentGroup.isSet;
    if (message.trim() || uploadedFileUrl) {
      const fullMessage = uploadedFileUrl
        ? `${message}|^^|${attachmentName}|^^|${uploadedFileUrl}`
        : message;

      sendMessage(fullMessage);

      if (isGroup) {
        setOfflineGroupChatLatest({
          id: new Date().getTime(),
          sender: "user",
          message: fullMessage,
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
            message: fullMessage,
            timestamp: new Date().toISOString(),
          },
        ]);
      }

      setUpdateMessageStatus((prevStatus) => !prevStatus);
      setMessage("");
      setUploadedFileUrl(null);
      setAttachmentName(null);
      setIsTyping(false);
      setErrorMessage(null); // Clear any previous error message
    } else if (uploadedFileUrl) {
      setErrorMessage("You cannot send an attachment without a message.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus("uploading");
      const response = await fetch(GET_AWS_PRE_SIGNED_URL_FOR_UPLOAD_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const data = await response.json();
      const uploadUrl = data.url;

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      };
      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = await fetch(
            GET_AWS_PRE_SIGNED_URL_FOR_DOWNLOAD_ROUTE,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fileName: file.name,
                actionType: "open",
              }),
            }
          );
          const downloadData = await response.json();
          setUploadedFileUrl(downloadData.url);
          setAttachmentName(file.name);
          setUploadProgress(0);
          setUploadStatus("completed");
          setTimeout(() => setUploadStatus(null), 2000); // Unmount after 2 seconds
        } else {
          console.error("File upload failed");
        }
      };
      xhr.onerror = () => {
        console.error("File upload error");
      };
      xhr.send(file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    if (isTyping) {
      const typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000);

      return () => clearTimeout(typingTimeout);
    }
  }, [isTyping]);

  const UploadProgress = () => (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg">
      {uploadStatus === "uploading" ? (
        <div>
          <p>Uploading: {uploadProgress}%</p>
        </div>
      ) : (
        <div className="flex items-center">
          <CheckCircle className="text-green-500 mr-2" />
          <p>Upload Complete</p>
        </div>
      )}
    </div>
  );

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
                  onChange={handleTyping}
                  onKeyDown={handleKeyDown}
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
          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}
        </div>
      ) : (
        <>
          <BackgroundBeamsWithCollision className="h-full flex justify-start items-start">
            <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight mt-4">
              <TextGenerateEffect
                words={textGenerateEffectWords}
                textColor="text-slate-300"
              />
            </h2>
          </BackgroundBeamsWithCollision>
        </>
      )}
      {uploadStatus && <UploadProgress />}
    </>
  );
};

export default ChatArea;
