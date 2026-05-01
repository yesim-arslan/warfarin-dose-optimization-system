// src/algorithms/distribute.ts
import { WeeklyPlan } from "./types";

export function distributeWeeklyDoseEvenly(totalMg: number): WeeklyPlan {
  const perDay = totalMg / 7;
  const daily = Array.from({ length: 7 }, () => roundTo2(perDay));
  // yuvarlamadan dolayı toplam sapabilir; basit düzeltme:
  const sum = daily.reduce((a, b) => a + b, 0);
  const diff = roundTo2(totalMg - sum);
  daily[6] = roundTo2(daily[6] + diff);

  return { dailyDoseMg: daily, totalMg: roundTo2(daily.reduce((a,b)=>a+b,0)) };
}

function roundTo2(n: number) {
  return Math.round(n * 100) / 100;
}