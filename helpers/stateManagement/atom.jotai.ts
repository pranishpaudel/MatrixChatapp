import { time } from "console";
import { atom } from "jotai";

// Define the Chat type
interface Chat {
  id: number;
  sender: "user" | "other";
  message: string;
  timestamp: string;
}

// Define the complete jotaiAtoms object
const jotaiAtoms = {
  isLoginForm: atom(true),
  currentLoginEmail: atom(""),
  updateFriendStatus: atom(false),
  currentSenderId: atom(""),
  currentChatFriend: atom({
    id: "",
    firstName: "",
    lastName: "",
    image: "",
    isSet: false,
  }),
  updateMessageStatus: atom(false),
  lastMessageReceived: atom({
    userType: "",
    message: "",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }),
};

export default jotaiAtoms;
