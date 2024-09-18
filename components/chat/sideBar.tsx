"use client";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import ProfileComponent from "./ProfileComponent";
import ContactSearchForm from "./ContactSearchForm";
import { useEffect, useState } from "react";

type Friend = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
};

interface OfflineChat {
  id: number;
  sender: "user" | "other";
  senderUid?: string;
  receiverUid?: string;
  offlineMessage?: boolean;
  isRead: boolean;
  message: string;
  timestamp: string;
}

const SideBar = () => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [allFriendsInfo, setAllFriendsInfo] = useState<Friend[]>([]);
  const [updateFriendStatus] = useAtom(jotaiAtoms.updateFriendStatus);
  const [currentChatFriend, setCurrentChatFriend] = useAtom(
    jotaiAtoms.currentChatFriend
  );
  const [isFetching, setIsFetching] = useState(true);
  const [selectedFriendIndex, setSelectedFriendIndex] = useState<number | null>(
    null
  );
  const [offlineChatHistory, setOfflineChatHistory] = useAtom<OfflineChat[]>(
    jotaiAtoms.offlineChatHistory
  );

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  useEffect(() => {
    // Fetch friends list
    fetch("/api/getFriendsList")
      .then((response) => response.json())
      .then((data) => {
        setAllFriendsInfo(data.data); // Set entire array of friends
        setIsFetching(false);
      });
  }, [setAllFriendsInfo, updateFriendStatus]);

  const handleFriendClick = (index: number) => {
    setSelectedFriendIndex(index);

    const selectedFriend = allFriendsInfo[index];
    setCurrentChatFriend({
      id: selectedFriend.id,
      firstName: selectedFriend.firstName,
      lastName: selectedFriend.lastName,
      image: selectedFriend.image,
      isSet: true,
    });

    // Mark the latest message as read for the selected friend
    const updatedOfflineChatHistory = offlineChatHistory.map((chat) => {
      if (
        chat.senderUid === selectedFriend.id &&
        chat.isRead === false &&
        chat.message !== "!TYPING...!"
      ) {
        return { ...chat, isRead: true };
      }
      return chat;
    });
    setOfflineChatHistory(updatedOfflineChatHistory);
  };

  const hasUnreadMessages = (friendId: string) => {
    // Check if the current chat friend is the same as the friendId
    if (currentChatFriend?.id === friendId) {
      return false;
    }

    return offlineChatHistory.some(
      (chat) =>
        chat.senderUid === friendId &&
        chat.isRead === false &&
        chat.message !== "!TYPING...!"
    );
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-col justify-start items-start w-full">
        <div id="directMessageSection" className="w-full">
          <div className="flex items-center text-lg text-gray-300 mb-4 px-[10%]">
            <span>Direct Messages</span>
            <Plus
              className="ml-4 cursor-pointer hover:scale-150 transition-transform duration-200"
              onClick={toggleFormVisibility}
            />
          </div>

          {/* Loop through friends and display */}
          {allFriendsInfo && allFriendsInfo.length > 0 ? (
            allFriendsInfo.map((friend: Friend, index: number) => (
              <div
                key={index}
                onClick={() => handleFriendClick(index)}
                className={`flex items-center space-x-3 text-slate-300 text-lg w-full py-2 px-[10%] cursor-pointer 
                transition-colors duration-200 hover:bg-slate-600 ${
                  selectedFriendIndex === index ? "bg-purple-700" : ""
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      friend.image
                        ? friend.image
                        : "https://github.com/shadcn.png"
                    }
                    alt={`${friend.firstName}`}
                  />
                </Avatar>
                <span>
                  {friend.firstName} {friend.lastName}
                </span>
                {hasUnreadMessages(friend.id) && (
                  <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    New
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 px-[10%]">
              {isFetching ? "Searching For Friends" : "No friends added yet."}
            </p>
          )}
        </div>

        <div className="flex items-center text-lg text-gray-300 mt-4 px-[10%]">
          <span>Channels</span>
          <Plus
            className="ml-4 cursor-pointer hover:scale-150 transition-transform duration-200"
            onClick={toggleFormVisibility}
          />
        </div>

        <div className="absolute bottom-0 mb-6 ml-[25px]">
          <ProfileComponent />
        </div>
      </div>

      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <ContactSearchForm onClose={toggleFormVisibility} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
