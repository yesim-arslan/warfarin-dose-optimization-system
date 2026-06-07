import { DoseInput, DoseResult } from "./doseTypes";
import { getTargetRange } from "./doseRules";

type DoseRule = {
  min: number;
  max: number;
  changeRatio: number;
  action: string;
  warnings: string[];
  nextCheck: string;
};

const stopWarnings = ["U-4", "U-5", "U-6"];

const sharedStopRules: DoseRule[] = [
  {
    min: 5.0,
    max: 6.0,
    changeRatio: 0,
    action: "İlaç STOP, 2 gün bekle",
    warnings: stopWarnings,
    nextCheck: "3. gün INR kontrolü",
  },
  {
    min: 6.0,
    max: 7.0,
    changeRatio: 0,
    action: "İlaç STOP, 3 gün bekle",
    warnings: stopWarnings,
    nextCheck: "4. gün INR kontrolü",
  },
  {
    min: 7.0,
    max: Number.POSITIVE_INFINITY,
    changeRatio: 0,
    action: "İlaç STOP, 4 gün bekle",
    warnings: stopWarnings,
    nextCheck: "5. gün INR kontrolü",
  },
];

const protocolRules: Record<DoseInput["indication"], DoseRule[]> = {
  af_stroke: [
    {
      min: 1.0,
      max: 1.5,
      changeRatio: 2 / 7,
      action:
        "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı; iğne tedavisi gerekebilir",
      warnings: ["U-1", "U-7"],
      nextCheck: "1 hafta sonra",
    },
    {
      min: 1.5,
      max: 2.0,
      changeRatio: 1 / 7,
      action:
        "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı; iğne tedavisi gerekebilir",
      warnings: ["U-1", "U-7"],
      nextCheck: "5 gün sonra",
    },
    {
      min: 2.0,
      max: 2.5,
      changeRatio: 1 / 14,
      action: "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı",
      warnings: ["U-2"],
      nextCheck: "1 ay sonra",
    },
    {
      min: 2.5,
      max: 3.5,
      changeRatio: 0,
      action: "Aynı doz devam",
      warnings: [],
      nextCheck: "1 ay sonra",
    },
    {
      min: 3.5,
      max: 4.0,
      changeRatio: -1 / 14,
      action: "Haftalık toplam doz azaltılmalı ve günlere dağıtılmalı",
      warnings: ["U-3"],
      nextCheck: "1 ay sonra",
    },
    {
      min: 4.0,
      max: 5.0,
      changeRatio: -1 / 7,
      action: "1 gün doz atla, sonra haftalık toplam dozu azaltarak devam et",
      warnings: ["U-3", "U-5"],
      nextCheck: "1 hafta sonra",
    },
    ...sharedStopRules,
  ],
  single_valve: [
    {
      min: 1.0,
      max: 1.5,
      changeRatio: 2 / 7,
      action:
        "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı; iğne tedavisi gerekebilir",
      warnings: ["U-1", "U-7"],
      nextCheck: "1 hafta sonra",
    },
    {
      min: 1.5,
      max: 2.0,
      changeRatio: 1 / 7,
      action:
        "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı; iğne tedavisi gerekebilir",
      warnings: ["U-1", "U-7"],
      nextCheck: "5 gün sonra",
    },
    {
      min: 2.0,
      max: 2.5,
      changeRatio: 1 / 14,
      action: "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı",
      warnings: ["U-2"],
      nextCheck: "1 ay sonra",
    },
    {
      min: 2.5,
      max: 3.0,
      changeRatio: 0,
      action: "Aynı doz devam",
      warnings: [],
      nextCheck: "1 ay sonra",
    },
    {
      min: 3.0,
      max: 4.0,
      changeRatio: -1 / 14,
      action: "Haftalık toplam doz azaltılmalı ve günlere dağıtılmalı",
      warnings: ["U-3"],
      nextCheck: "1 ay sonra",
    },
    {
      min: 4.0,
      max: 5.0,
      changeRatio: -1 / 7,
      action: "1 gün doz atla, sonra haftalık toplam dozu azaltarak devam et",
      warnings: ["U-3", "U-5"],
      nextCheck: "1 hafta sonra",
    },
    ...sharedStopRules,
  ],
  double_valve: [
    {
      min: 1.0,
      max: 1.5,
      changeRatio: 2 / 7,
      action:
        "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı; iğne tedavisi gerekebilir",
      warnings: ["U-1", "U-7"],
      nextCheck: "1 hafta sonra",
    },
    {
      min: 1.5,
      max: 2.0,
      changeRatio: 1 / 7,
      action:
        "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı; iğne tedavisi gerekebilir",
      warnings: ["U-1", "U-7"],
      nextCheck: "5 gün sonra",
    },
    {
      min: 2.0,
      max: 3.0,
      changeRatio: 1 / 14,
      action: "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı",
      warnings: ["U-2"],
      nextCheck: "1 ay sonra",
    },
    {
      min: 3.0,
      max: 3.5,
      changeRatio: 0,
      action: "Aynı doz devam",
      warnings: [],
      nextCheck: "1 ay sonra",
    },
    {
      min: 3.5,
      max: 4.0,
      changeRatio: -1 / 14,
      action: "Haftalık toplam doz azaltılmalı ve günlere dağıtılmalı",
      warnings: ["U-3"],
      nextCheck: "1 ay sonra",
    },
    {
      min: 4.0,
      max: 5.0,
      changeRatio: -1 / 7,
      action: "1 gün doz atla, sonra haftalık toplam dozu azaltarak devam et",
      warnings: ["U-3", "U-5"],
      nextCheck: "1 hafta sonra",
    },
    ...sharedStopRules,
  ],
  thrombosis: [
    {
      min: 1.0,
      max: 1.5,
      changeRatio: 1 / 7,
      action:
        "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı; iğne tedavisi gerekebilir",
      warnings: ["U-1", "U-7"],
      nextCheck: "1 hafta sonra",
    },
    {
      min: 1.5,
      max: 2.0,
      changeRatio: 1 / 14,
      action:
        "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı; iğne tedavisi gerekebilir",
      warnings: ["U-2", "U-7"],
      nextCheck: "5 gün sonra",
    },
    {
      min: 2.0,
      max: 3.0,
      changeRatio: 0,
      action: "Aynı doz devam",
      warnings: [],
      nextCheck: "1 ay sonra",
    },
    {
      min: 3.0,
      max: 4.0,
      changeRatio: -1 / 14,
      action: "Haftalık toplam doz azaltılmalı ve günlere dağıtılmalı",
      warnings: ["U-3"],
      nextCheck: "1 ay sonra",
    },
    {
      min: 4.0,
      max: 5.0,
      changeRatio: -1 / 7,
      action: "1 gün doz atla, sonra haftalık toplam dozu azaltarak devam et",
      warnings: ["U-3", "U-5"],
      nextCheck: "1 hafta sonra",
    },
    ...sharedStopRules,
  ],
};

function roundToHalfTabletStep(mg: number): number {
  return Math.round(mg / 2.5) * 2.5;
}

export function calculateDose(input: DoseInput): DoseResult {
  const { indication, currentInr, weeklyDoseMg } = input;
  const target = getTargetRange(indication);

  const rules = protocolRules[indication];
  const rule =
    rules.find((item) => currentInr >= item.min && currentInr < item.max) ??
    rules[0];
  const suggestedWeeklyDoseMg = weeklyDoseMg + weeklyDoseMg * rule.changeRatio;

  return {
    targetMin: target.min,
    targetMax: target.max,
    targetLabel: target.label,
    suggestedWeeklyDoseMg: roundToHalfTabletStep(suggestedWeeklyDoseMg),
    action: rule.action,
    warnings: rule.warnings,
    nextCheck: rule.nextCheck,
  };
}
