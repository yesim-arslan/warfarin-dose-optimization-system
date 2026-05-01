import { DoseInput, DoseResult } from "./doseTypes";
import { getTargetRange } from "./doseRules";

function roundToHalfTabletStep(mg: number): number {
  return Math.round(mg / 2.5) * 2.5;
}

export function calculateDose(input: DoseInput): DoseResult {
  const { indication, currentInr, weeklyDoseMg } = input;
  const target = getTargetRange(indication);

  let suggestedWeeklyDoseMg = weeklyDoseMg;
  let action = "Aynı doz devam";
  let warnings: string[] = [];
  let nextCheck = "1 ay sonra";

  // Şimdilik en detaylı kural: af_stroke (hedef 2.5 - 3.5)
  // Grafikteki bandlara göre birebir işlendi.
  if (indication === "af_stroke") {
    if (currentInr < 1.5) {
      suggestedWeeklyDoseMg = weeklyDoseMg + (2 / 7) * weeklyDoseMg;
      action = "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı; iğne tedavisi gerekebilir";
      warnings = ["U-1", "U-7"];
      nextCheck = "1 hafta sonra";
    } else if (currentInr < 2.0) {
      suggestedWeeklyDoseMg = weeklyDoseMg + (1 / 7) * weeklyDoseMg;
      action = "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı; iğne tedavisi gerekebilir";
      warnings = ["U-1", "U-7"];
      nextCheck = "5 gün sonra";
    } else if (currentInr < 2.5) {
      suggestedWeeklyDoseMg = weeklyDoseMg + (1 / 14) * weeklyDoseMg;
      action = "Haftalık toplam doz artırılmalı ve günlere dağıtılmalı";
      warnings = ["U-2"];
      nextCheck = "1 ay sonra";
    } else if (currentInr <= 3.5) {
      suggestedWeeklyDoseMg = weeklyDoseMg;
      action = "Aynı doz devam";
      warnings = [];
      nextCheck = "1 ay sonra";
    } else if (currentInr < 4.0) {
      suggestedWeeklyDoseMg = weeklyDoseMg - (1 / 14) * weeklyDoseMg;
      action = "Haftalık toplam doz azaltılmalı ve günlere dağıtılmalı";
      warnings = [];
      nextCheck = "1 ay sonra";
    } else if (currentInr < 5.0) {
      suggestedWeeklyDoseMg = weeklyDoseMg - (1 / 7) * weeklyDoseMg;
      action = "1 gün doz atla, sonra haftalık toplam dozu azaltarak devam et";
      warnings = ["U-3", "U-5"];
      nextCheck = "1 hafta sonra";
    } else if (currentInr < 6.0) {
      suggestedWeeklyDoseMg = weeklyDoseMg;
      action = "İlaç STOP, 2 gün bekle";
      warnings = ["U-4", "U-5", "U-6"];
      nextCheck = "3. gün INR kontrolü";
    } else if (currentInr < 7.0) {
      suggestedWeeklyDoseMg = weeklyDoseMg;
      action = "İlaç STOP, 3 gün bekle";
      warnings = ["U-4", "U-5", "U-6"];
      nextCheck = "4. gün INR kontrolü";
    } else {
      suggestedWeeklyDoseMg = weeklyDoseMg;
      action = "İlaç STOP, 4 gün bekle";
      warnings = ["U-4", "U-5", "U-6"];
      nextCheck = "5. gün INR kontrolü";
    }
  } else {
    // Şimdilik diğer indication’lar için mevcut genel mantığın iyileştirilmiş hali
    if (currentInr >= target.min && currentInr <= target.max) {
      suggestedWeeklyDoseMg = weeklyDoseMg;
      action = "Aynı doz devam";
      warnings = [];
      nextCheck = "1 ay sonra";
    } else if (currentInr < target.min) {
      suggestedWeeklyDoseMg = weeklyDoseMg + weeklyDoseMg / 14;
      action = "Haftalık toplam doz artırılmalı";
      warnings = ["U-2"];
      nextCheck = "5 gün ila 1 hafta sonra";
    } else if (currentInr > target.max && currentInr < 4.0) {
      suggestedWeeklyDoseMg = weeklyDoseMg - weeklyDoseMg / 14;
      action = "Haftalık toplam doz azaltılmalı";
      warnings = [];
      nextCheck = "1 ay sonra";
    } else if (currentInr >= 4.0 && currentInr < 5.0) {
      suggestedWeeklyDoseMg = weeklyDoseMg - weeklyDoseMg / 7;
      action = "1 doz atlayın, sonrasında haftalık dozu azaltın";
      warnings = ["U-3", "U-5"];
      nextCheck = "1 hafta sonra";
    } else if (currentInr >= 5.0 && currentInr < 6.0) {
      suggestedWeeklyDoseMg = weeklyDoseMg;
      action = "İlacı 2 gün boyunca bırakın";
      warnings = ["U-4", "U-5", "U-6"];
      nextCheck = "3. gün INR kontrolü";
    } else if (currentInr >= 6.0 && currentInr < 7.0) {
      suggestedWeeklyDoseMg = weeklyDoseMg;
      action = "İlacı 3 gün boyunca bırakın";
      warnings = ["U-4", "U-5", "U-6"];
      nextCheck = "4. gün INR kontrolü";
    } else if (currentInr >= 7.0) {
      suggestedWeeklyDoseMg = weeklyDoseMg;
      action = "İlacı 4 gün boyunca bırakın";
      warnings = ["U-4", "U-5", "U-6"];
      nextCheck = "5. gün INR kontrolü";
    }
  }

  return {
    targetMin: target.min,
    targetMax: target.max,
    targetLabel: target.label,
    suggestedWeeklyDoseMg: roundToHalfTabletStep(suggestedWeeklyDoseMg),
    action,
    warnings,
    nextCheck,
  };
}