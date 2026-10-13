import { GLYCEMIC_PROFILE_TIMES } from "../model/constants";

import type {
  GlycemicProfileDay,
  GlycemicProfileMeasurement,
  GlycemicProfileTime,
} from "../model/types";

const createDayId = (): string => {
  return Date.now().toString() + Math.random().toString(36).slice(2, 6);
};

export const getTodayLocalDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const createEmptyMeasurement = (
  time: GlycemicProfileTime,
  isCustom = false,
): GlycemicProfileMeasurement => ({
  time,
  glycemia: null,
  insulinUnits: null,
  breadUnits: null,
  bolusInsulinUnits: null,
  basalInsulinUnits: null,
  note: "",
  ...(isCustom ? { isCustom: true } : {}),
});

export const createGlycemicProfileDay = (
  date = getTodayLocalDate(),
): GlycemicProfileDay => ({
  id: createDayId(),
  date,
  measurements: GLYCEMIC_PROFILE_TIMES.map((time) =>
    createEmptyMeasurement(time),
  ),
});

/**
 * Старые таблицы содержали 24 часа, включая 00:00,
 * а 24:00 из ещё более ранних версий переносилось в 00:00.
 * Новая таблица называет это измерение 24:00.
 * Остальные пользовательские/старые измерения сохраняем,
 * даже если они не входят в шесть основных времён.
 */
export const normalizeGlycemicProfileDay = (
  day: GlycemicProfileDay,
): GlycemicProfileDay => {
  const measurements = Array.isArray(day.measurements) ? day.measurements : [];
  const byTime = new Map<GlycemicProfileTime, GlycemicProfileMeasurement>();

  // Если одновременно существуют 00:00 и 24:00,
  // не объединяем потенциально разные измерения: сохраняем оба.
  const hasExplicitMidnight = measurements.some(
    (measurement) => measurement.time === "24:00",
  );

  for (const source of measurements) {
    const time =
      source.time === "00:00" &&
      source.isCustom !== true &&
      !hasExplicitMidnight
        ? "24:00"
        : source.time;

    const normalized = {
      ...createEmptyMeasurement(time),
      ...source,
      time,
    };

    // Сохранённые дополнительные часы с данными остаются видимыми,
    // даже если пользователь позже очистит соответствующую ячейку.
    if (
      !GLYCEMIC_PROFILE_TIMES.includes(time) &&
      (normalized.glycemia != null ||
        normalized.insulinUnits != null ||
        normalized.breadUnits != null ||
        normalized.bolusInsulinUnits != null ||
        normalized.basalInsulinUnits != null ||
        Boolean(normalized.note?.trim()))
    ) {
      normalized.isCustom = true;
    }

    const existing = byTime.get(time);

    if (!existing) {
      byTime.set(time, normalized);
      continue;
    }

    byTime.set(time, {
      ...existing,
      glycemia: existing.glycemia ?? normalized.glycemia,
      insulinUnits: existing.insulinUnits ?? normalized.insulinUnits,
      breadUnits: existing.breadUnits ?? normalized.breadUnits,
      bolusInsulinUnits:
        existing.bolusInsulinUnits ?? normalized.bolusInsulinUnits,
      basalInsulinUnits:
        existing.basalInsulinUnits ?? normalized.basalInsulinUnits,
      note: existing.note || normalized.note,
      isCustom: existing.isCustom || normalized.isCustom,
    });
  }

  for (const time of GLYCEMIC_PROFILE_TIMES) {
    if (!byTime.has(time)) {
      byTime.set(time, createEmptyMeasurement(time));
    }
  }

  return {
    ...day,
    measurements: Array.from(byTime.values()).sort((a, b) =>
      a.time.localeCompare(b.time),
    ),
  };
};
