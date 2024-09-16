import { atom } from "jotai";

// Define the Chat type
interface Chat {
  id: number;
  sender: "user" | "other";
  message: string;
  timestamp: string;
}

// Create the localChatHistory atom
const localChatHistory = atom<Chat[]>([]);

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
  localChatHistory,
};

export default jotaiAtoms;
