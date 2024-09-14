"use client";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import ProfileComponent from "./ProfileComponent";
import ContactSearchForm from "./ContactSearchForm";
import { useEffect, useState } from "react";
type Friend = {
  firstName: string;
  lastName: string;
  image: string;
};

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
    setSelectedFriendIndex(index); // Set selected friend index

    // Update currentChatFriend atom with the selected friend's details
    const selectedFriend = allFriendsInfo[index];
    setCurrentChatFriend({
      firstName: selectedFriend.firstName,
      lastName: selectedFriend.lastName,
      image: selectedFriend.image,
      isSet: true,
    });
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
            allFriendsInfo.map((friend: any, index: number) => (
              <div
                key={index}
                onClick={() => handleFriendClick(index)}
                className={`flex items-center space-x-3 text-slate-300 text-lg w-full py-2 px-[10%] cursor-pointer 
                transition-colors duration-200 hover:bg-purple-600 ${
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
                    alt={`@${friend.firstName}`}
                  />
                </Avatar>
                <span>
                  {friend.firstName} {friend.lastName}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 px-[10%]">
              {isFetching ? "Searching For Friends" : "No friends added yet."}
            </p>
          )}
        </div>

        <div className="text-lg text-gray-300 mt-4 px-[10%]">Channels</div>
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
