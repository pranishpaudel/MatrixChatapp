import { atom } from "jotai";

interface offlineChat {
  id: number;
  sender: "user" | "other";
  senderUid?: string;
  receiverUid?: string;
  offlineMessage?: boolean;
  isGroup?: boolean;
  isRead: boolean;
  message: string;
  timestamp: string;
}

interface OfflineGroupChat {
  id: string | number;
  sender: "user" | "other";
  message: string;
  timestamp: string;
  fromSocket: boolean;
  groupId?: string;
  senderId: string;
  senderFirstName: string;
  senderLastName: string;
  senderImage: string;
}

interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
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
  currentGroup: atom({
    id: "",
    name: "",
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
  // New chatHistory atom
  offlineChatHistory: atom<offlineChat[]>([]),
  chatFriendsUidCacheHistory: atom<string[]>([]),
  offlineGroupChatLatestMessage: atom<OfflineGroupChat>({
    id: "",
    sender: "user",
    message: "",
    timestamp: "",
    fromSocket: false,
    groupId: "",
    senderId: "",
    senderFirstName: "",
    senderLastName: "",
    senderImage: "",
  }),
  groupMembers: atom<GroupMember[]>([]),
};

export default jotaiAtoms;
