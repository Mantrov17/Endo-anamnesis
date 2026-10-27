import { DAILY_PROFILE_DEFAULT_TARGETS } from "../model/constants";
import type {
  DailyProfileDay,
  DailyProfileGlucoseEntry,
  DailyProfileInsulinEntry,
  DailyProfileMealEntry,
} from "../model/types";

const createId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const getTodayLocalDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const createDailyProfileGlucoseEntry = (
  time = "08:00",
): DailyProfileGlucoseEntry => ({
  id: createId(),
  time,
  value: null,
  note: "",
});

export const createDailyProfileMealEntry = (
  time = "08:00",
): DailyProfileMealEntry => ({
  id: createId(),
  time,
  breadUnits: null,
  mealType: "breakfast",
  note: "",
});

export const createDailyProfileInsulinEntry = (
  time = "08:00",
): DailyProfileInsulinEntry => ({
  id: createId(),
  time,
  insulinName: "aspart",
  units: null,
  note: "",
});

const sortByTime = <T extends { time: string }>(items: T[]): T[] =>
  [...items].sort((left, right) => left.time.localeCompare(right.time));

export const createDailyProfileDay = (
  date = getTodayLocalDate(),
): DailyProfileDay => ({
  id: createId(),
  date,
  targetRanges: { ...DAILY_PROFILE_DEFAULT_TARGETS },
  glucoseEntries: [],
  insulinEntries: [],
  mealEntries: [],
});

export const normalizeDailyProfileDay = (
  day: DailyProfileDay,
): DailyProfileDay => ({
  ...day,
  targetRanges: {
    fastingMin:
      day.targetRanges?.fastingMin ?? DAILY_PROFILE_DEFAULT_TARGETS.fastingMin,
    fastingMax:
      day.targetRanges?.fastingMax ?? DAILY_PROFILE_DEFAULT_TARGETS.fastingMax,
    postMealMax:
      day.targetRanges?.postMealMax ??
      DAILY_PROFILE_DEFAULT_TARGETS.postMealMax,
    hypoThreshold:
      day.targetRanges?.hypoThreshold ??
      DAILY_PROFILE_DEFAULT_TARGETS.hypoThreshold,
  },
  glucoseEntries: sortByTime(day.glucoseEntries ?? []),
  insulinEntries: sortByTime(day.insulinEntries ?? []),
  mealEntries: sortByTime(day.mealEntries ?? []),
});
