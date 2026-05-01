export type WeeklyDoseItem = {
  day: string;
  dose: number;
};

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function roundToHalfTabletStep(mg: number): number {
  return Math.round(mg / 2.5) * 2.5;
}

function getSpreadIndices(count: number): number[] {
  const patterns: Record<number, number[]> = {
    1: [0],
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 2, 4, 6],
    5: [0, 1, 3, 4, 6],
    6: [0, 1, 2, 3, 5, 6],
    7: [0, 1, 2, 3, 4, 5, 6],
  };

  return patterns[count] ?? [];
}

export function generateWeeklySchedule(weeklyDoseMg: number): WeeklyDoseItem[] {
  const normalizedWeeklyDose = roundToHalfTabletStep(weeklyDoseMg);

  const totalHalfTabletUnits = Math.round(normalizedWeeklyDose / 2.5);
  const baseUnitsPerDay = Math.floor(totalHalfTabletUnits / 7);
  const remainderUnits = totalHalfTabletUnits % 7;

  const unitsPerDay = new Array(7).fill(baseUnitsPerDay);

const spreadIndices = getSpreadIndices(remainderUnits);
  for (const dayIndex of spreadIndices) {
    unitsPerDay[dayIndex] += 1;
  }

  return DAYS.map((day, index) => ({
    day,
    dose: unitsPerDay[index] * 2.5,
  }));
}