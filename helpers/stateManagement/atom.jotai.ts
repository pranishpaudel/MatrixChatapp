import { atom } from "jotai";

const jotaiAtoms = {
  isLoginForm: atom(true),
  currentLoginEmail: atom(""),
};

export default jotaiAtoms;
