import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

export const subscribeAuth = (cb: (user: User | null) => void) => {
  return onAuthStateChanged(auth, cb);
};