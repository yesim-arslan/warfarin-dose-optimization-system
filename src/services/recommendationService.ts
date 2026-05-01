import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { recommend } from "../algorithms";
import { DoseRecommendation } from "../types/models";

export const generateRecommendation = async (params: {
  uid: string;
  indication: any;
  measuredInr: number;
  measuredAt: string;
  currentWeeklyTotalDoseMg: number;
}) => {

  const result = recommend(params);

  const record: DoseRecommendation = {
    uid: params.uid,

    input: {
      indication: params.indication,
      measuredInr: params.measuredInr,
      measuredAt: params.measuredAt,
      currentWeeklyTotalDoseMg: params.currentWeeklyTotalDoseMg,
    },

    output: {
      algorithmVersion: result.algorithmVersion,
      targetBand: result.targetBand,
      newWeeklyTotalDoseMg: result.newWeeklyTotalDoseMg,
      nextCheckAt: result.nextCheckAt,
      nextCheckInDays: result.nextCheckInDays,
    },

    plan: result.plan,
    warnings: result.warnings,
    actionSummary: result.actionSummary,

    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, "recommendations"), record);

  return {
    id: ref.id,
    ...record,
  };
};