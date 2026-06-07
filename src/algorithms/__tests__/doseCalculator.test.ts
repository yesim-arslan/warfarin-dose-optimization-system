import { calculateDose } from "../doseCalculator";

test("tek kapak protez hedef aralığı 2.5-3.0 ve INR 3.2 azaltım önerir", () => {
  const result = calculateDose({
    indication: "single_valve",
    currentInr: 3.2,
    weeklyDoseMg: 35,
  });

  expect(result.targetLabel).toBe("2.5 - 3.0");
  expect(result.suggestedWeeklyDoseMg).toBe(32.5);
  expect(result.nextCheck).toBe("1 ay sonra");
});

test("çift kapak protez hedef aralığı 3.0-3.5 ve INR 2.8 artırır", () => {
  const result = calculateDose({
    indication: "double_valve",
    currentInr: 2.8,
    weeklyDoseMg: 35,
  });

  expect(result.targetLabel).toBe("3.0 - 3.5");
  expect(result.suggestedWeeklyDoseMg).toBe(37.5);
  expect(result.warnings).toContain("U-2");
});

test("pıhtı takibinde INR 1.6 için 1/14 artış ve 5 gün kontrol", () => {
  const result = calculateDose({
    indication: "thrombosis",
    currentInr: 1.6,
    weeklyDoseMg: 35,
  });

  expect(result.targetLabel).toBe("2.0 - 3.0");
  expect(result.suggestedWeeklyDoseMg).toBe(37.5);
  expect(result.nextCheck).toBe("5 gün sonra");
});
