// src/algorithms/engine.ts
import { addDays } from "./time";
import { PROTOCOLS } from "./protocol";
import {
  InrInput, Recommendation, TargetInrBand, ProtocolRule,
} from "./types";
import { WARNING_META, renderWarningMessage } from "./warnings";
import { distributeWeeklyDoseEvenly } from "./distribute";
import { GENERAL_WARNINGS } from "./warnings";

export function getTargetBandFromIndication(indication: InrInput["indication"]): TargetInrBand {
  // Hedef INR bandları dokümanda listelenmiş. :contentReference[oaicite:19]{index=19}
  switch (indication) {
    case "AF_OR_STROKE": return "2_5__3_5";
    case "MECH_VALVE_SINGLE": return "2_5__3_0";
    case "MECH_VALVE_DOUBLE": return "3_0__3_5";
    case "THROMBUS_DVT_PTE": return "2_0__3_0";
  }
}

export function findRule(band: TargetInrBand, inr: number): ProtocolRule {
  const rules = PROTOCOLS[band];
  const rule = rules.find(r => inr >= r.match.inrMinInclusive && inr < r.match.inrMaxExclusive);
  if (!rule) {
    // Teorik olarak olmamalı (0..inf kapsıyoruz)
    throw new Error(`No protocol rule for INR=${inr} in band=${band}`);
  }
  return rule;
}

export function computeNewWeeklyTotal(current: number, rule: ProtocolRule): number {
  const action = rule.action;

  if (action.type === "CONTINUE_SAME") return current;

  if (action.type === "INCREASE_WEEKLY_TOTAL" || action.type === "DECREASE_WEEKLY_TOTAL") {
    const fraction = action.change?.fractionOfWeeklyTotal ?? 0;
    const next = current + current * fraction;
    return roundTo2(next);
  }

  if (action.type === "SKIP_DOSE_DAYS") {
    // Protokolde: "1 gün doz atla, sonra HTD - (1/7xHTD)" gibi durumlar var. :contentReference[oaicite:20]{index=20}
    // Bu kuralı iki parçalı ele alacağız:
    // 1) skipDays UI'ye/planlamaya bilgi verir
    // 2) HTD azaltımı için band tablonda net: -1/7 (bu kısmı burada uygularız)
    const next = current + current * (-1 / 7);
    return roundTo2(next);
  }

  if (action.type === "STOP_MEDICATION") {
    // STOP durumunda yeni HTD üretmek yerine "0" verilebilir
    // Ama klinik pratikte "geçici durdur" olduğu için biz HTD'yi aynen bırakıp planı boş dönebiliriz.
    return current;
  }

  return current;
}

export function recommend(input: InrInput): Recommendation {
  const band = getTargetBandFromIndication(input.indication);
  const rule = findRule(band, input.measuredInr);

  const newWeeklyTotal = computeNewWeeklyTotal(input.currentWeeklyTotalDoseMg, rule);

  // Basit dağıtım: şimdilik eşit dağıt (7 güne böl).
  // İleride tablet mg / yarım-çeyrek gibi yuvarlama ekleriz.
  const plan = distributeWeeklyDoseEvenly(newWeeklyTotal);

  const nextCheckAt = addDays(input.measuredAt, rule.nextCheckInDays);

  // Uyarı metinlerini üret
  const warnings = rule.warnings.map(code => ({
    code,
    severity: WARNING_META[code].severity,
    title: WARNING_META[code].title,
    message: renderWarningMessage(code, {
      nextCheckInDays: rule.nextCheckInDays,
      planText: plan ? plan.dailyDoseMg.map((d, i) => `Gün ${i + 1}: ${d} mg`).join("\n")
      : undefined,
    }),
  }));

  const warningCodes = Array.from(
  new Set([
    ...rule.warnings,
    ...GENERAL_WARNINGS,
    "U-9",
  ])
);

  // U-8, U-10, U-11, U-12 gibi “genel” uyarıları her öneriye eklemek isteyebilirsin.
  // Şimdilik sadece kuralın ürettiklerini döndürüyoruz.

  return {
    algorithmVersion: "v1.0.0",
    targetBand: band,
    newWeeklyTotalDoseMg: newWeeklyTotal,
    plan,
    nextCheckAt,
    nextCheckInDays: rule.nextCheckInDays,

    actionSummary: {
      type: rule.action.type,
      skipDays: rule.action.skipDays,
      waitDays: rule.action.waitDays,
    },
    
    warnings,
    appliedRule: {
      inrRange: `[${rule.match.inrMinInclusive}, ${rule.match.inrMaxExclusive})`,
      action: rule.action,
    },
  };
}

function roundTo2(n: number) {
  return Math.round(n * 100) / 100;
}