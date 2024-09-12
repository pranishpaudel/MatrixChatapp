import { Input } from "../ui/input";
import { Paperclip, Smile, SendHorizontal } from "lucide-react";

const ChatArea = () => {
  return (
    <div className="ml-2 h-full flex flex-col">
      <div className="flex-grow">
        {/* Chat messages can be displayed here */}
      </div>
      <div id="input" className="mb-4 ml-5">
        <div className="flex items-center w-[70%] space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Enter your message"
              className="w-full h-[4em] bg-gray-800 text-slate-300 text-lg pr-20"
              enableFocusRing={false}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-slate-300">
              <Paperclip className="cursor-pointer" />
              <Smile className="cursor-pointer" />
            </div>
          </div>

          <button className="h-[4em] ml-2 px-4 bg-blue-600 text-white text-lg rounded">
            <SendHorizontal className="hover:text-slate-400 h-[100%]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;