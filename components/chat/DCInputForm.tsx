import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  ADD_FRIEND_ROUTE,
  SEARCH_CONTACT_BY_NAME_ROUTE,
  CREATE_CHAT_GROUP_ROUTE,
} from "@/constants/routes";
import Lottie from "react-lottie";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";

interface DCInputFormProps {
  onClose: () => void;
  compType: "searchFriend" | "createGroup";
}

function DCInputForm({ onClose, compType }: DCInputFormProps) {
  const [searchText, setSearchText] = React.useState("");
  const [updateFriendStatus, setUpdateFriendStatus] = useAtom(
    jotaiAtoms.updateFriendStatus
  );
  const [searchResults, setSearchResults] = React.useState<
    {
      id: string;
      firstName: string | null;
      lastName: string;
      email: string;
      image: string | null;
    }[]
  >([]);
  const [selectedFriendIds, setSelectedFriendIds] = React.useState<string[]>(
    []
  );
  const [groupName, setGroupName] = React.useState("");
  const isGroup = compType === "createGroup" ? true : false;
  // Add friend function
  const addFriend = React.useCallback(async () => {
    if (selectedFriendIds.length === 0) return;

    try {
      const response = await fetch(ADD_FRIEND_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friendId: selectedFriendIds[0], // Assuming single friend selection for add friend
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUpdateFriendStatus(!updateFriendStatus);
        onClose(); // Close the card after the friend is added successfully
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  }, [selectedFriendIds, onClose, setUpdateFriendStatus, updateFriendStatus]);

  // Create group function
  const createGroup = React.useCallback(async () => {
    if (!groupName || selectedFriendIds.length === 0) return;

    try {
      const response = await fetch(CREATE_CHAT_GROUP_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupName,
          groupMembers: selectedFriendIds,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onClose(); // Close the card after the group is created successfully
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  }, [groupName, selectedFriendIds, onClose]);

  // Trigger addFriend when selectedFriendIds changes for searchFriend
  React.useEffect(() => {
    if (compType === "searchFriend" && selectedFriendIds.length > 0) {
      addFriend();
    }
  }, [selectedFriendIds, addFriend, compType]);

  // Fetch the search results based on the search text
  React.useEffect(() => {
    const searchContact = async () => {
      if (searchText) {
        const response = await fetch(SEARCH_CONTACT_BY_NAME_ROUTE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchText,
            isGroup,
          }),
        });
        const data = await response.json();
        setSearchResults(data.data || []);
      } else {
        setSearchResults([]);
      }
    };
    searchContact();
  }, [searchText]);

  return (
    <Card className="w-[350px] relative bg-gray-800">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <X />
      </button>
      <CardHeader>
        <CardTitle className="text-md">
          {compType === "searchFriend"
            ? "Search your friend"
            : "Create a group"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {compType === "createGroup" && (
          <Input
            type="text"
            id="groupName"
            enableFocusRing={false}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="w-full h-[3em] text-slate-300 text-lg mb-4"
          />
        )}
        <Input
          type="text"
          id="search"
          enableFocusRing={false}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search for your friend"
          className="w-full h-[3em] text-slate-300 text-lg"
        />
        <ul className="mt-4 max-h-40 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <li
                key={result.id}
                className={`cursor-pointer p-2 hover:bg-gray-900 rounded-md ${
                  selectedFriendIds.includes(result.id) ? "bg-gray-700" : ""
                }`}
                onClick={() => {
                  setSelectedFriendIds((prev) =>
                    prev.includes(result.id)
                      ? prev.filter((id) => id !== result.id)
                      : [...prev, result.id]
                  );
                }}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        result.image
                          ? result.image
                          : "https://avatars.dicebear.com/api/avataaars/shadcn.svg"
                      }
                      alt="@shadcn"
                      height={40}
                      width={40}
                    />
                  </Avatar>
                  <div className="flex flex-col justify-center">
                    <div className="text-slate-300">
                      <strong>
                        {result.firstName ?? ""} {result.lastName}
                      </strong>
                    </div>
                    <div className="text-slate-400">{result.email}</div>
                  </div>
                </div>
              </li>
            ))
          ) : searchText ? (
            <li className="text-slate-400">No contacts found</li>
          ) : null}
          {searchText.length <= 0 && (
            <Lottie
              isClickToPauseDisabled={true}
              height={200}
              width={200}
              options={{
                loop: true,
                autoplay: true,
                animationData: require("@/public/lottie-json.json"),
              }}
            />
          )}
        </ul>
        {compType === "createGroup" && (
          <Button
            className="mt-4 w-full"
            onClick={createGroup}
            disabled={!groupName || selectedFriendIds.length === 0}
          >
            Create Group
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default DCInputForm;
