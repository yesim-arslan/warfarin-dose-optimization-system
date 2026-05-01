import { Indication } from "./doseTypes";

export type TargetRange = {
  min: number;
  max: number;
  label: string;
};

export function getTargetRange(indication: Indication): TargetRange {
  switch (indication) {
    case "af_stroke":
      return { min: 2.5, max: 3.5, label: "2.5 - 3.5" };

    case "single_valve":
      return { min: 2.5, max: 3.0, label: "2.5 - 3.0" };

    case "double_valve":
      return { min: 3.0, max: 3.5, label: "3.0 - 3.5" };

    case "thrombosis":
      return { min: 2.0, max: 3.0, label: "2.0 - 3.0" };

    default:
      return { min: 2.0, max: 3.0, label: "2.0 - 3.0" };
  }
}