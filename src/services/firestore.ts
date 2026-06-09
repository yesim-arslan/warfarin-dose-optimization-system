import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
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
    requiresInitialIndication: true,
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

export const getLatestInrRecord = async (uid: string) => {
  const snapshot = await getDocs(
    query(collection(db, "inrRecords"), where("uid", "==", uid))
  );

  if (snapshot.empty) {
    return null;
  }

  const records = snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<InrRecord, "id">),
  }));

  return records.sort(
    (left, right) =>
      new Date(right.measuredAt).getTime() -
      new Date(left.measuredAt).getTime()
  )[0];
};

export const getInrRecords = async (uid: string) => {
  const snapshot = await getDocs(
    query(collection(db, "inrRecords"), where("uid", "==", uid))
  );

  const records = snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<InrRecord, "id">),
  }));

  return records.sort(
    (left, right) =>
      new Date(right.measuredAt).getTime() -
      new Date(left.measuredAt).getTime()
  );
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, data, { merge: true });
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
};

export const updateUserThemeMode = async (
  uid: string,
  themeMode: NonNullable<UserProfile["themeMode"]>
) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { themeMode }, { merge: true });
};

export const updateUserLanguage = async (
  uid: string,
  language: NonNullable<UserProfile["language"]>
) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { language }, { merge: true });
};

export const deleteUserData = async (uid: string) => {
  const collectionsToClear = ["inrRecords", "recommendations"];
  const batch = writeBatch(db);

  for (const collectionName of collectionsToClear) {
    const snapshot = await getDocs(
      query(collection(db, collectionName), where("uid", "==", uid))
    );

    snapshot.docs.forEach((document) => {
      batch.delete(document.ref);
    });
  }

  await batch.commit();
  await deleteDoc(doc(db, "users", uid));
};
