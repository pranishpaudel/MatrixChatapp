import ChatArea from "@/components/chat/chatArea";
import LogoArea from "@/components/chat/logoArea";
import SideBar from "@/components/chat/sideBar";
import { Separator } from "@/components/ui/separator";
import ChatNavArea from "../../components/chat/chatNavArea";

const Page = () => {
  return (
    <div className="grid grid-cols-12 grid-rows-12 h-screen">
      <div className="col-span-2 row-span-12 flex">
        <div className="flex-1">
          <div id="logo" className="row-span-2">
            <LogoArea />
          </div>
          <div id="sidebar" className="row-span-10 mt-5">
            <SideBar />
          </div>
        </div>
        <Separator className="h-full" orientation="vertical" />
      </div>

      <div id="navArea" className="col-span-10 row-span-1">
        <ChatNavArea />
      </div>
      <div id="mainChatArea" className="col-span-10 row-span-11 ">
        <ChatArea />
      </div>
    </div>
  );
};

export default Page;
