import type {
  DailyProfileInsulinCategory,
  DailyProfileInsulinName,
  DailyProfileMealType,
} from "./types";

export interface InsulinProfileMeta {
  id: DailyProfileInsulinName;
  label: string;
  shortLabel: string;
  category: DailyProfileInsulinCategory;

  /** Начало действия, часы после введения. */
  onsetHoursMin: number;
  onsetHoursMax: number;

  /** Интервал пика, если он определён. */
  peakHoursMin?: number;
  peakHoursMax?: number;

  /**
   * Первая граница длительности.
   * Не указываем, если известно только "до N часов".
   */
  durationHoursMin?: number;

  /** Конец диапазона или максимальная длительность. */
  durationHoursMax: number;
}

export const DAILY_PROFILE_MEAL_TYPE_LABELS: Record<
  DailyProfileMealType,
  string
> = {
  breakfast: "Завтрак",
  lunch: "Обед",
  dinner: "Ужин",
  snack: "Перекус",
};

export const DAILY_PROFILE_INSULINS: InsulinProfileMeta[] = [
  {
    id: "insulin_glargine_100",
    label: "Инсулин Гларгин 100",
    shortLabel: "Гларгин 100",
    category: "basal",
    onsetHoursMin: 1,
    onsetHoursMax: 2,
    durationHoursMax: 29,
  },
  {
    id: "insulin_glargine_300",
    label: "Инсулин Гларгин 300",
    shortLabel: "Гларгин 300",
    category: "basal",
    onsetHoursMin: 1,
    onsetHoursMax: 2,
    durationHoursMax: 36,
  },
  {
    id: "insulin_detemir",
    label: "Инсулин Детемир",
    shortLabel: "Детемир",
    category: "basal",
    onsetHoursMin: 1,
    onsetHoursMax: 2,
    durationHoursMax: 12,
  },
  {
    id: "insulin_isophane",
    label: "Инсулин-Изофан",
    shortLabel: "Изофан",
    category: "basal",
    onsetHoursMin: 2,
    onsetHoursMax: 2,
    peakHoursMin: 6,
    peakHoursMax: 10,
    durationHoursMin: 12,
    durationHoursMax: 16,
  },
  {
    id: "aspart_ultra",
    label: "Аспарт (+ н/к)",
    shortLabel: "Аспарт + н/к",
    category: "bolus",
    onsetHoursMin: 1 / 60,
    onsetHoursMax: 1 / 60,
    peakHoursMin: 0.75,
    peakHoursMax: 1.5,
    durationHoursMin: 3,
    durationHoursMax: 5,
  },
  {
    id: "lispro_100_ultra",
    label: "ЛизПро 100 (+ н/к)",
    shortLabel: "ЛизПро 100 + н/к",
    category: "bolus",
    onsetHoursMin: 1 / 60,
    onsetHoursMax: 1 / 60,
    peakHoursMin: 0.75,
    peakHoursMax: 1.5,
    durationHoursMin: 3,
    durationHoursMax: 5,
  },
  {
    id: "lispro_200_ultra",
    label: "ЛизПро 200 (+ н/к)",
    shortLabel: "ЛизПро 200 + н/к",
    category: "bolus",
    onsetHoursMin: 1 / 60,
    onsetHoursMax: 1 / 60,
    peakHoursMin: 0.75,
    peakHoursMax: 1.5,
    durationHoursMin: 3,
    durationHoursMax: 5,
  },
  {
    id: "aspart",
    label: "Аспарт",
    shortLabel: "Аспарт",
    category: "bolus",
    onsetHoursMin: 5 / 60,
    onsetHoursMax: 15 / 60,
    peakHoursMin: 1,
    peakHoursMax: 2,
    durationHoursMin: 4,
    durationHoursMax: 5,
  },
  {
    id: "lispro_100",
    label: "ЛизПро 100",
    shortLabel: "ЛизПро 100",
    category: "bolus",
    onsetHoursMin: 5 / 60,
    onsetHoursMax: 15 / 60,
    peakHoursMin: 1,
    peakHoursMax: 2,
    durationHoursMin: 4,
    durationHoursMax: 5,
  },
  {
    id: "lispro_200",
    label: "ЛизПро 200",
    shortLabel: "ЛизПро 200",
    category: "bolus",
    onsetHoursMin: 5 / 60,
    onsetHoursMax: 15 / 60,
    peakHoursMin: 1,
    peakHoursMax: 2,
    durationHoursMin: 4,
    durationHoursMax: 5,
  },
  {
    id: "glulisine",
    label: "Глулизин",
    shortLabel: "Глулизин",
    category: "bolus",
    onsetHoursMin: 5 / 60,
    onsetHoursMax: 15 / 60,
    peakHoursMin: 1,
    peakHoursMax: 2,
    durationHoursMin: 4,
    durationHoursMax: 5,
  },
  {
    id: "human_regular",
    label: "Человеческий растворимый генно-инженерный",
    shortLabel: "Человеческий растворимый",
    category: "bolus",
    onsetHoursMin: 20 / 60,
    onsetHoursMax: 30 / 60,
    peakHoursMin: 2,
    peakHoursMax: 4,
    durationHoursMin: 5,
    durationHoursMax: 6,
  },
];

export const DAILY_PROFILE_DEFAULT_TARGETS = {
  fastingMin: 5.5,
  fastingMax: 7.5,
  postMealMax: 10,
  hypoThreshold: 4,
} as const;

export const DAILY_PROFILE_HOURS = Array.from(
  { length: 13 },
  (_, index) => `${String(index * 2).padStart(2, "0")}:00`,
);
