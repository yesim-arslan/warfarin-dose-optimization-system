// src/algorithms/protocol.ts
import { ProtocolRule, TargetInrBand } from "./types";

const frac = (n: number, d: number) => n / d;

export const PROTOCOLS: Record<TargetInrBand, ProtocolRule[]> = {
  // AF / İnme gibi: hedef 2.5-3.5
  "2_5__3_5": [
    // 1.0 - 1.5: HTD + (2/7*HTD) + iğne, 1 hafta sonra, U-1 ve U-7
    {
      match: { inrMinInclusive: 1.0, inrMaxExclusive: 1.5 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(2, 7) }, notes: ["İğne tedavisi gerekebilir"] },
      warnings: ["U-1", "U-7"],
      nextCheckInDays: 7,
    },
    // 1.5 - 2.0: HTD + (1/7) + iğne, 5 gün sonra, U-1 ve U-7
    {
      match: { inrMinInclusive: 1.5, inrMaxExclusive: 2.0 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(1, 7) }, notes: ["İğne tedavisi gerekebilir"] },
      warnings: ["U-1", "U-7"],
      nextCheckInDays: 5,
    },
    // 2.0 - 2.5: HTD + (1/14), 1 ay sonra, U-2
    {
      match: { inrMinInclusive: 2.0, inrMaxExclusive: 2.5 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(1, 14) } },
      warnings: ["U-2"],
      nextCheckInDays: 30,
    },
    // 2.5 - 3.5: aynen devam, 1 ay sonra
    {
      match: { inrMinInclusive: 2.5, inrMaxExclusive: 3.5 },
      action: { type: "CONTINUE_SAME" },
      warnings: [],
      nextCheckInDays: 30,
    },
    // 3.5 - 4.0: HTD - (1/14), 1 ay sonra
    {
      match: { inrMinInclusive: 3.5, inrMaxExclusive: 4.0 },
      action: { type: "DECREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: -frac(1, 14) } },
      warnings: [],
      nextCheckInDays: 30,
    },
    // 4.0 - 5.0: 1 gün doz atla, sonra HTD - (1/7), 1 hafta sonra, U-3 ve U-5
    {
      match: { inrMinInclusive: 4.0, inrMaxExclusive: 5.0 },
      action: { type: "SKIP_DOSE_DAYS", skipDays: 1, notes: ["Sonrasında HTD azaltılacak"] },
      warnings: ["U-3", "U-5"],
      nextCheckInDays: 7,
    },
    // 5.0 - 6.0: STOP, 2 gün bekle, 3. gün kontrol, U-4 U-5 U-6
    {
      match: { inrMinInclusive: 5.0, inrMaxExclusive: 6.0 },
      action: { type: "STOP_MEDICATION", waitDays: 2 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 3,
    },
    // 6.0 - 7.0: STOP, 3 gün bekle, 4. gün kontrol
    {
      match: { inrMinInclusive: 6.0, inrMaxExclusive: 7.0 },
      action: { type: "STOP_MEDICATION", waitDays: 3 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 4,
    },
    // 7.0+: STOP, 4 gün bekle, 5. gün kontrol
    {
      match: { inrMinInclusive: 7.0, inrMaxExclusive: Number.POSITIVE_INFINITY },
      action: { type: "STOP_MEDICATION", waitDays: 4 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 5,
    },
  ],

  // Tek kapak: hedef 2.5-3.0 (tabloda 3.0 - 4.0 arası azaltım vs.) :contentReference[oaicite:3]{index=3}
  "2_5__3_0": [
    // İlk 3 kural aynı: 1.0-1.5, 1.5-2.0, 2.0-2.5
    // Hedef bandı: 2.5-3.0
    // Üst kademeler: 3.0-4.0 azaltım, 4.0-5.0 skip+azalt, 5+ STOP...
    // (Aşağıda aynen kuruyoruz.)
    {
      match: { inrMinInclusive: 1.0, inrMaxExclusive: 1.5 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(2, 7) }, notes: ["İğne tedavisi gerekebilir"] },
      warnings: ["U-1", "U-7"],
      nextCheckInDays: 7,
    },
    {
      match: { inrMinInclusive: 1.5, inrMaxExclusive: 2.0 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(1, 7) }, notes: ["İğne tedavisi gerekebilir"] },
      warnings: ["U-1", "U-7"],
      nextCheckInDays: 5,
    },
    {
      match: { inrMinInclusive: 2.0, inrMaxExclusive: 2.5 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(1, 14) } },
      warnings: ["U-2"],
      nextCheckInDays: 30,
    },
    {
      match: { inrMinInclusive: 2.5, inrMaxExclusive: 3.0 },
      action: { type: "CONTINUE_SAME" },
      warnings: [],
      nextCheckInDays: 30,
    },
    {
      match: { inrMinInclusive: 3.0, inrMaxExclusive: 4.0 },
      action: { type: "DECREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: -frac(1, 14) } },
      warnings: [],
      nextCheckInDays: 30,
    },
    {
      match: { inrMinInclusive: 4.0, inrMaxExclusive: 5.0 },
      action: { type: "SKIP_DOSE_DAYS", skipDays: 1, notes: ["Sonrasında HTD azaltılacak"] },
      warnings: ["U-3", "U-5"],
      nextCheckInDays: 7,
    },
    {
      match: { inrMinInclusive: 5.0, inrMaxExclusive: 6.0 },
      action: { type: "STOP_MEDICATION", waitDays: 2 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 3,
    },
    {
      match: { inrMinInclusive: 6.0, inrMaxExclusive: 7.0 },
      action: { type: "STOP_MEDICATION", waitDays: 3 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 4,
    },
    {
      match: { inrMinInclusive: 7.0, inrMaxExclusive: Number.POSITIVE_INFINITY },
      action: { type: "STOP_MEDICATION", waitDays: 4 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 5,
    },
  ],

  // Çift kapak: hedef 3.0-3.5 (2.0-3.0 arası +1/14 ve U-2, hedef bandı 3.0-3.5) :contentReference[oaicite:4]{index=4}
  "3_0__3_5": [
    {
      match: { inrMinInclusive: 1.0, inrMaxExclusive: 1.5 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(2, 7) }, notes: ["İğne tedavisi gerekebilir"] },
      warnings: ["U-1", "U-7"],
      nextCheckInDays: 7,
    },
    {
      match: { inrMinInclusive: 1.5, inrMaxExclusive: 2.0 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(1, 7) }, notes: ["İğne tedavisi gerekebilir"] },
      warnings: ["U-1", "U-7"],
      nextCheckInDays: 5,
    },
    {
      match: { inrMinInclusive: 2.0, inrMaxExclusive: 3.0 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(1, 14) } },
      warnings: ["U-2"],
      nextCheckInDays: 30,
    },
    {
      match: { inrMinInclusive: 3.0, inrMaxExclusive: 3.5 },
      action: { type: "CONTINUE_SAME" },
      warnings: [],
      nextCheckInDays: 30,
    },
    {
      match: { inrMinInclusive: 3.5, inrMaxExclusive: 4.0 },
      action: { type: "DECREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: -frac(1, 14) } },
      warnings: [],
      nextCheckInDays: 30,
    },
    {
      match: { inrMinInclusive: 4.0, inrMaxExclusive: 5.0 },
      action: { type: "SKIP_DOSE_DAYS", skipDays: 1, notes: ["Sonrasında HTD azaltılacak"] },
      warnings: ["U-3", "U-5"],
      nextCheckInDays: 7,
    },
    {
      match: { inrMinInclusive: 5.0, inrMaxExclusive: 6.0 },
      action: { type: "STOP_MEDICATION", waitDays: 2 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 3,
    },
    {
      match: { inrMinInclusive: 6.0, inrMaxExclusive: 7.0 },
      action: { type: "STOP_MEDICATION", waitDays: 3 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 4,
    },
    {
      match: { inrMinInclusive: 7.0, inrMaxExclusive: Number.POSITIVE_INFINITY },
      action: { type: "STOP_MEDICATION", waitDays: 4 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 5,
    },
  ],

  // Pıhtı (DVT/PTE vb): hedef 2.0-3.0 ve düşük INR tarafında artış oranları biraz farklı :contentReference[oaicite:5]{index=5}
  "2_0__3_0": [
    {
      match: { inrMinInclusive: 1.0, inrMaxExclusive: 1.5 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(1, 7) }, notes: ["İğne tedavisi gerekebilir"] },
      warnings: ["U-1", "U-7"],
      nextCheckInDays: 7,
    },
    {
      match: { inrMinInclusive: 1.5, inrMaxExclusive: 2.0 },
      action: { type: "INCREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: frac(1, 14) }, notes: ["İğne tedavisi gerekebilir"] },
      warnings: ["U-1", "U-7"],
      nextCheckInDays: 5,
    },
    {
      match: { inrMinInclusive: 2.0, inrMaxExclusive: 3.0 },
      action: { type: "CONTINUE_SAME" },
      warnings: ["U-2"], // tabloda bu satırda U-2 görünüyor
      nextCheckInDays: 30,
    },
    {
      match: { inrMinInclusive: 3.0, inrMaxExclusive: 4.0 },
      action: { type: "DECREASE_WEEKLY_TOTAL", change: { fractionOfWeeklyTotal: -frac(1, 14) } },
      warnings: [],
      nextCheckInDays: 30,
    },
    {
      match: { inrMinInclusive: 4.0, inrMaxExclusive: 5.0 },
      action: { type: "SKIP_DOSE_DAYS", skipDays: 1, notes: ["Sonrasında HTD azaltılacak"] },
      warnings: ["U-3", "U-5"],
      nextCheckInDays: 7,
    },
    {
      match: { inrMinInclusive: 5.0, inrMaxExclusive: 6.0 },
      action: { type: "STOP_MEDICATION", waitDays: 2 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 3,
    },
    {
      match: { inrMinInclusive: 6.0, inrMaxExclusive: 7.0 },
      action: { type: "STOP_MEDICATION", waitDays: 3 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 4,
    },
    {
      match: { inrMinInclusive: 7.0, inrMaxExclusive: Number.POSITIVE_INFINITY },
      action: { type: "STOP_MEDICATION", waitDays: 4 },
      warnings: ["U-4", "U-5", "U-6"],
      nextCheckInDays: 5,
    },
  ],
};