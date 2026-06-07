import {
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import { auth } from "./firebase";
import { deleteUserData } from "./firestore";

export const subscribeAuth = (cb: (user: User | null) => void) => {
  return onAuthStateChanged(auth, cb);
};

export const deleteAccount = async (user: User, password: string) => {
  if (!user.email) {
    throw new Error("Bu hesap için e-posta adresi bulunamadı.");
  }

  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
  await deleteUserData(user.uid);
  await deleteUser(user);
};
