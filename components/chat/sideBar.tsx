"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import ProfileComponent from "./ProfileComponent";
import ContactSearchForm from "./ContactSearchForm";

const SideBar = () => {
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-col justify-start items-start w-full">
        <div className="flex items-center text-lg mb-4 text-gray-300 relative left-[10%]">
          Direct Messages
          <Plus
            className="mr-2 ml-4 cursor-pointer hover:scale-150 transition-transform duration-200"
            onClick={toggleFormVisibility}
          />
        </div>
        <div className="text-lg text-gray-300 relative left-[10%]">
          Channels
        </div>
        <div className="absolute bottom-0 mb-6 ml-[25px]">
          <ProfileComponent />
        </div>
      </div>
      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <ContactSearchForm onClose={toggleFormVisibility} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
