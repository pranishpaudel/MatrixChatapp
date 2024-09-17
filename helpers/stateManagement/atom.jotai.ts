import { atom } from "jotai";

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
    isSet: false,
    userType: "",
    message: "",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    senderId: "", // Optional property
    receiverId: "", // Optional property
  }),
};

export default jotaiAtoms;
