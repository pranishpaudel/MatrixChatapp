import { atom } from "jotai";

const jotaiAtoms = {
  isLoginForm: atom(true),
  currentLoginEmail: atom(""),
  updateFriendStatus: atom(false),
  currentChatFriend: atom({
    firstName: "",
    lastName: "",
    image: "",
    isSet: false,
  }),
};

export default jotaiAtoms;
