import LogoArea from "@/components/chat/logoArea";
import SideBar from "@/components/chat/sideBar";

const Page = () => {
  return (
    <div className="grid grid-cols-12 grid-rows-12 h-screen">
      <div id="logo" className="col-span-2 row-span-2">
        <LogoArea />
      </div>
      <div id="navArea" className="col-span-10 row-span-2"></div>
      <div id="sidebar" className="col-span-2 row-span-10">
        <SideBar />
      </div>
      <div id="mainChatArea" className="col-span-10 row-span-10"></div>
    </div>
  );
};

export default Page;
