import { atom } from "jotai";

const jotaiAtoms = {
  isLoginForm: atom(true),
  currentLoginEmail: atom(""),
  updateFriendStatus: atom(false),
};

export default jotaiAtoms;
