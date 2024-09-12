import LogoArea from "@/components/chat/logoArea";
import SideBar from "@/components/chat/sideBar";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  return (
    <div className="grid grid-cols-12 grid-rows-12 h-screen">
      <div className="col-span-2 row-span-12">
        <div id="logo" className="row-span-2">
          <LogoArea />
        </div>
        <div id="sidebar" className="row-span-10">
          <SideBar />
        </div>
      </div>
      <div className="col-span-1 row-span-12">
        <Separator className="h-full" orientation="vertical" />
      </div>
      <div id="navArea" className="col-span-9 row-span-2"></div>
      <div id="mainChatArea" className="col-span-9 row-span-10"></div>
    </div>
  );
};

export default Page;
