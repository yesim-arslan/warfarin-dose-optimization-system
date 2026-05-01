import { recommend } from "../engine";

test("AF bandında INR 1.8 => +1/7 ve 5 gün kontrol", () => {
  const rec = recommend({
    uid: "u1",
    indication: "AF_OR_STROKE",
    measuredInr: 1.8,
    measuredAt: "2026-03-03T12:00:00.000Z",
    currentWeeklyTotalDoseMg: 35,
  });

  // 35 + 35*(1/7)=40
  expect(rec.newWeeklyTotalDoseMg).toBeCloseTo(40, 2);
  expect(rec.nextCheckInDays).toBe(5);
  expect(rec.warnings.map(w => w.code)).toEqual(
    expect.arrayContaining(["U-1", "U-7"])
  );
});

test("INR 6.2 => STOP + 4 gün kontrol (band bağımsız üst protokol)", () => {
  const rec = recommend({
    uid: "u1",
    indication: "AF_OR_STROKE",
    measuredInr: 6.2,
    measuredAt: "2026-03-03T12:00:00.000Z",
    currentWeeklyTotalDoseMg: 35,
  });

  expect(rec.nextCheckInDays).toBe(4);
  expect(rec.warnings.map(w => w.code)).toEqual(
    expect.arrayContaining(["U-4", "U-5", "U-6"])
  );
});