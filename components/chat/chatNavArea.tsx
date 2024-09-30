"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
import { EllipsisVertical } from "lucide-react";
import React from "react";
const ChatNavArea = () => {
  const [currentChatFriend] = useAtom(jotaiAtoms.currentChatFriend);
  const [currentGroup] = useAtom(jotaiAtoms.currentGroup);

  return (
    <>
      {currentChatFriend.isSet ? (
        <div className="h-full flex flex-col">
          <div className="flex-grow flex items-center justify-between px-7">
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
              </Avatar>
              <span className="text-lg font-semibold">
                {currentChatFriend.firstName} {currentChatFriend.lastName}
              </span>
            </div>
            <EllipsisVertical className="ml-auto" />
          </div>
          <Separator className="w-full" />
        </div>
      ) : currentGroup.isSet ? (
        <div className="h-full flex flex-col">
          <div className="flex-grow flex items-center justify-between px-7">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  alt="@group"
                />
              </Avatar>
              <span className="text-lg font-semibold">{currentGroup.name}</span>
            </div>
            <EllipsisVertical className="ml-auto" />
          </div>
          <Separator className="w-full" />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ChatNavArea;
