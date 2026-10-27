export type DailyProfileMealType = "breakfast" | "lunch" | "dinner" | "snack";

export type DailyProfileInsulinName =
  | "insulin_glargine_100"
  | "insulin_glargine_300"
  | "insulin_detemir"
  | "insulin_isophane"
  | "aspart_ultra"
  | "lispro_100_ultra"
  | "lispro_200_ultra"
  | "aspart"
  | "lispro_100"
  | "lispro_200"
  | "glulisine"
  | "human_regular";

export type DailyProfileInsulinCategory = "basal" | "bolus";

export interface DailyProfileTargetRanges {
  fastingMin: number;
  fastingMax: number;
  postMealMax: number;
  hypoThreshold: number;
}

export interface DailyProfileGlucoseEntry {
  id: string;
  time: string;
  value: number | null;
  note: string;
}

export interface DailyProfileMealEntry {
  id: string;
  time: string;
  breadUnits: number | null;
  mealType: DailyProfileMealType;
  note: string;
}

export interface DailyProfileInsulinEntry {
  id: string;
  time: string;
  insulinName: DailyProfileInsulinName;
  units: number | null;
  note: string;
}

export interface DailyProfileDay {
  id: string;
  date: string;
  targetRanges: DailyProfileTargetRanges;
  glucoseEntries: DailyProfileGlucoseEntry[];
  insulinEntries: DailyProfileInsulinEntry[];
  mealEntries: DailyProfileMealEntry[];
}

export interface DailyProfile {
  days: DailyProfileDay[];
  createdAt: string;
  updatedAt: string;
}
