export type Indication =
  | "af_stroke"
  | "single_valve"
  | "double_valve"
  | "thrombosis";

export type DoseInput = {
  indication: Indication;
  currentInr: number;
  weeklyDoseMg: number;
};

export type DoseResult = {
  targetMin: number;
  targetMax: number;
  targetLabel: string;
  suggestedWeeklyDoseMg: number;
  action: string;
  warnings: string[];
  nextCheck: string;
};