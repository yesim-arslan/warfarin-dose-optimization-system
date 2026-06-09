import { Indication } from "../algorithms/doseTypes";

export type TherapyIndication = Indication;

export type UserProfile = {
  uid: string;
  email: string;
  createdAt: any; // serverTimestamp
  indication?: TherapyIndication;
  targetInrMin?: number;
  targetInrMax?: number;
  currentWeeklyDoseMg?: number;
  themeMode?: "light" | "dark";
  language?: "tr" | "en";
  requiresInitialIndication?: boolean;
};

export type InrRecord = {
  id?: string;
  uid: string;
  inr: number;
  measuredAt: string; // ISO date/time string
  createdAt: any; // serverTimestamp
};

export interface DoseRecommendation {
  uid: string;

  input: {
    indication: string;
    measuredInr: number;
    measuredAt: string;
    currentWeeklyTotalDoseMg: number;
  };

  output: {
    algorithmVersion: string;
    targetBand: string;
    newWeeklyTotalDoseMg: number;
    nextCheckAt: string;
    nextCheckInDays: number;
  };

  plan?: {
    dailyDoseMg: number[];
    totalMg: number;
  };

  warnings: {
    code: string;
    severity: string;
    title: string;
    message: string;
  }[];

  actionSummary: {
    type: string;
    skipDays?: number;
    waitDays?: number;
  };

  createdAt: any;
}
