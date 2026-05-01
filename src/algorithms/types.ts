export type ISODateString = string; // "2026-03-03T12:34:56.000Z"

export type Indication =
  | "AF_OR_STROKE"         // AF + inme vb. (2.5-3.5)
  | "MECH_VALVE_SINGLE"    // tek kapak (2.5-3.0)
  | "MECH_VALVE_DOUBLE"    // çift kapak (3.0-3.5)
  | "THROMBUS_DVT_PTE";    // kalp içi/büyük damar/bacak pıhtı (2.0-3.0)

export type TargetInrBand =
  | "2_5__3_5"
  | "2_5__3_0"
  | "3_0__3_5"
  | "2_0__3_0";

export type WarningCode =
  | "U-1" | "U-2" | "U-3" | "U-4" | "U-5" | "U-6"
  | "U-7" | "U-8" | "U-9" | "U-10" | "U-11" | "U-12";

export type WarningSeverity = "info" | "warning" | "danger";

export type DoseActionType =
  | "CONTINUE_SAME"
  | "INCREASE_WEEKLY_TOTAL"
  | "DECREASE_WEEKLY_TOTAL"
  | "SKIP_DOSE_DAYS"    // "1 gün doz atla"
  | "STOP_MEDICATION"   // "İlaç STOP"
  | "WAIT_DAYS";        // "X gün bekle"

export interface DoseChange {
  /** + ise artır, - ise azalt. Örn: +1/7, +1/14, -1/14, -1/7 */
  fractionOfWeeklyTotal: number; // örn 1/7 => 0.142857...
}

export interface ProtocolAction {
  type: DoseActionType;

  /** HTD bazlı artış/azalış varsa */
  change?: DoseChange;

  /** kaç gün doz atlanacak? (ör: 1 gün) */
  skipDays?: number;

  /** kaç gün bekle? (ör: 2 gün) */
  waitDays?: number;

  /** iğne tedavisi notu gibi */
  notes?: string[];
}

export interface InrInput {
  uid: string;
  indication: Indication;
  measuredInr: number;             // girilen INR
  measuredAt: ISODateString;       // ölçüm zamanı
  currentWeeklyTotalDoseMg: number; // HTD (mg)
  // İleride: tabletStrengthMg, currentPlan, interactions vs.
}

export interface RuleMatch {
  inrMinInclusive: number;
  inrMaxExclusive: number; // sınırlar çakışmasın diye [min, max)
}

export interface ProtocolRule {
  match: RuleMatch;
  action: ProtocolAction;

  /** Bu kural çalışınca üretilecek uyarılar */
  warnings: WarningCode[];

  /** Kontrol zamanı önerisi (gün cinsinden) */
  nextCheckInDays: number;
}

export interface WeeklyPlan {
  /** 7 güne dağıtılmış doz (mg) */
  dailyDoseMg: number[]; // length 7
  totalMg: number;
}

export interface Recommendation {
  targetBand: TargetInrBand;

  /** yeni HTD */
  newWeeklyTotalDoseMg: number;

  /** 7 güne dağıtılmış plan (opsiyonel ama önerilir) */
  plan?: WeeklyPlan;

  /** kontrol zamanı */
  nextCheckAt: ISODateString;
  nextCheckInDays: number;

  /** uyarılar */

  actionSummary: {
    type: DoseActionType;
    skipDays?: number;
    waitDays?: number;
  }
  
  warnings: Array<{
    code: WarningCode;
    severity: WarningSeverity;
    title: string;
    message: string;
  }>;

  /** motorun aldığı karar (debug/audit için) */
  appliedRule: {
    inrRange: string;
    action: ProtocolAction;
  };

  algorithmVersion: string;
}