import ProfileComponent from "./ProfileComponent";

const SideBar = () => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col justify-start items-start w-full">
        <div className="text-lg mb-4 text-gray-300 relative left-[10%]">
          Direct Messages
        </div>
        <div className="text-lg text-gray-300 relative left-[10%]">
          Channels
        </div>
        <div className="absolute bottom-0 mb-3 ml-[25px]">
          <ProfileComponent />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
