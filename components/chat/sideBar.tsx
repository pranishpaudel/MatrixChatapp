import { Plus } from "lucide-react";
import ProfileComponent from "./ProfileComponent";

const SideBar = () => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col justify-start items-start w-full">
        <div className="flex items-center text-lg mb-4 text-gray-300 relative left-[10%]">
          Direct Messages
          <Plus className="mr-2 ml-4 cursor-pointer hover:scale-150 transition-transform duration-200" />
        </div>
        <div className="text-lg text-gray-300 relative left-[10%]">
          Channels
        </div>
        <div className="absolute bottom-0 mb-6 ml-[25px]">
          <ProfileComponent />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
