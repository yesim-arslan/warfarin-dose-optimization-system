export type TherapyIndication =
  | "AF"
  | "MECH_VALVE_SINGLE"
  | "MECH_VALVE_DOUBLE"
  | "VTE"
  | "OTHER";

export type UserProfile = {
  uid: string;
  email: string;
  createdAt: any; // serverTimestamp
  indication?: TherapyIndication;
  targetInrMin?: number;
  targetInrMax?: number;
  currentWeeklyDoseMg?: number;
};

export type InrRecord = {
  id?: string;
  uid: string;
  inr: number;
  measuredAt: string; // ISO date string (YYYY-MM-DD)
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