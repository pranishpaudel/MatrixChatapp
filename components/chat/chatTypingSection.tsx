import React from "react";

const ChatTypingSection = () => {
  return (
    <div className="h-full p-2 flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-start">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
            <div className="bg-[#1E201E] p-3 rounded-lg text-white text-lg">
              <p>I am good, thanks! What about you?</p>
            </div>
            <div className="text-gray-400 text-sm mt-1">10:15 AM</div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
            <div className="bg-purple-600 p-3 rounded-lg text-gray-200 text-lg">
              <p>Hey there! How are you?</p>
            </div>
            <div className="text-gray-400 text-sm mt-1">10:16 AM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTypingSection;
