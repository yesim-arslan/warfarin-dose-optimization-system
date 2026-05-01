export type TabletSlot = "full" | "half" | "empty";

export type TabletVisual = {
  tabletCount: number;
  mg: number;
  slots: TabletSlot[];
};

function roundToHalfTablet(value: number): number {
  return Math.round(value * 2) / 2;
}

export function getTabletVisual(
  dailyDoseMg: number,
  tabletStrengthMg: number = 5
): TabletVisual {
    const tabletCount = roundToHalfTablet(dailyDoseMg / tabletStrengthMg);
  let slots: TabletSlot[] = ["empty", "empty"];

  if (tabletCount >= 2) {
    slots = ["full", "full"];
  } else if (tabletCount >= 1.5) {
    slots = ["full", "half"];
  } else if (tabletCount >= 1) {
    slots = ["full", "empty"];
  } else if (tabletCount >= 0.5) {
    slots = ["half", "empty"];
  }

  return {
    tabletCount,
    mg: dailyDoseMg,
    slots,
  };
}