"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAtom } from "jotai";
import jotaiAtoms from "@/helpers/stateManagement/atom.jotai";
const ChatNavArea = () => {
  const [currentChatFriend] = useAtom(jotaiAtoms.currentChatFriend);
  return (
    <>
      {currentChatFriend.isSet ? (
        <>
          <div className="h-full flex flex-col">
            <div className="flex-grow flex items-center">
              <div className="flex items-center space-x-3 ml-7">
                {" "}
                {/* Added ml-4 for left margin */}
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
            </div>
            <Separator className="w-full" />
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ChatNavArea;
