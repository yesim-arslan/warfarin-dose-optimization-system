import { Indication } from "../algorithms/doseTypes";

export const indicationOptions: { label: string; value: Indication }[] = [
  {
    label: "Atrial fibrilasyon / inme",
    value: "af_stroke",
  },
  {
    label: "Tek kapak protez",
    value: "single_valve",
  },
  {
    label: "Çift kapak protez",
    value: "double_valve",
  },
  {
    label: "Kalp, büyük damar veya bacak damarında pıhtı",
    value: "thrombosis",
  },
];

export const getIndicationLabel = (value?: string) =>
  indicationOptions.find((option) => option.value === value)?.label ??
  "Seçilmedi";
