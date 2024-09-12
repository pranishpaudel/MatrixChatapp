import { Separator } from "../ui/separator";

const SideBar = () => {
  return (
    <div className="flex h-full">
      {/* Central Area for Text Items */}
      <div className="flex flex-col justify-start items-start w-full">
        <div className="text-lg mb-4 text-gray-300 relative left-[10%]">
          Direct Messages
        </div>
        <div className="text-lg text-gray-300 relative left-[10%]">
          Channels
        </div>
      </div>

      {/* Separator */}
      <div className="flex-shrink-0">
        <Separator className="h-full" orientation="vertical" />
      </div>
    </div>
  );
};

export default SideBar;
