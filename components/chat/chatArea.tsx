import { Input } from "../ui/input";

const ChatArea = () => {
  return (
    <div className="ml-2 h-full flex flex-col">
      <div className="flex-grow">
        {/* Chat messages can be displayed here */}
      </div>
      <div id="input" className="mb-4 ml-5">
        <Input
          type="text"
          placeholder="Enter your message"
          className="w-[70%] h-[4em] bg-gray-800"
          enableFocusRing={false}
        />
      </div>
    </div>
  );
};

export default ChatArea;
