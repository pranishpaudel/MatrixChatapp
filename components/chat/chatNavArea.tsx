"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

const ChatNavArea: React.FC = () => {
  const [currentChatFriend] = useAtom(jotaiAtoms.currentChatFriend);
  const [currentGroup] = useAtom(jotaiAtoms.currentGroup);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isMenuOpen && currentGroup.isSet && currentGroup.id) {
      setIsLoading(true);
      fetch("/api/getGroupMembers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId: currentGroup.id }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to fetch group members");
        })
        .then((data) => {
          setGroupMembers(data.data.members);
        })
        .catch((error) => {
          console.error("Error fetching group members:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [currentGroup.isSet, currentGroup.id, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderContent = () => {
    if (currentChatFriend.isSet) {
      return (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={
                currentChatFriend.image
                  ? currentChatFriend.image
                  : "https://github.com/shadcn.png"
              }
              alt="@shadcn"
            />
            <AvatarFallback>
              {`${currentChatFriend.firstName.charAt(
                0
              )}${currentChatFriend.lastName.charAt(0)}`}
            </AvatarFallback>
          </Avatar>
          <span className="text-lg font-semibold">
            {currentChatFriend.firstName} {currentChatFriend.lastName}
          </span>
        </div>
      );
    } else if (currentGroup.isSet) {
      return (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={"https://github.com/shadcn.png"} alt="@group" />
            <AvatarFallback>{currentGroup.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-lg font-semibold">{currentGroup.name}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="flex-grow flex items-center justify-between px-7 relative">
        {renderContent()}

        {currentGroup.isSet && (
          <Info className="ml-auto cursor-pointer" onClick={toggleMenu} />
        )}

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 z-10 dropdown-menu-adjust">
            <ScrollArea className="h-72 w-48 rounded-md border border-gray-700 bg-gray-800">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none text-gray-300">
                  Group Members
                </h4>
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-full mb-2 bg-zinc-700" />
                    <Skeleton className="h-6 w-full mb-2 bg-zinc-700" />
                    <Skeleton className="h-6 w-full mb-2 bg-zinc-700" />
                  </>
                ) : (
                  groupMembers.map((member) => (
                    <React.Fragment key={member.id}>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={member.image}
                            alt={`@${member.firstName}`}
                          />
                          <AvatarFallback>
                            {`${member.firstName.charAt(
                              0
                            )}${member.lastName.charAt(0)}`}
                          </AvatarFallback>
                        </Avatar>
                        <span>{`${member.firstName} ${member.lastName}`}</span>
                      </div>
                      <Separator className="my-2 bg-gray-700" />
                    </React.Fragment>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
      <Separator className="w-full bg-gray-700" />
    </div>
  );
};

export default ChatNavArea;
