import { doc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { InrRecord, UserProfile } from "../types/models";

export const createUserProfileIfMissing = async (profile: {
  uid: string;
  email: string | null;
}) => {
  const userRef = doc(db, "users", profile.uid);
  const data: UserProfile = {
    uid: profile.uid,
    email: profile.email ?? "",
    createdAt: serverTimestamp(),
    
  };
  // setDoc overwrite eder; ileride merge kullanacağız. Şimdilik basit:
  await setDoc(userRef, data, { merge: true });
};

export const addInrRecord = async (record: Omit<InrRecord, "createdAt" | "id">) => {
  const ref = await addDoc(collection(db, "inrRecords"), {
    ...record,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, data, { merge: true });
};