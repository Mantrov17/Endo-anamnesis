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

const createEmptyMeasurement = (
  time: GlycemicProfileTime,
): GlycemicProfileMeasurement => {
  return {
    time,

    glycemia: null,

    insulinUnits: null,

    breadUnits: null,

    note: "",
  };
};

export const createGlycemicProfileDay = (
  date = getTodayLocalDate(),
): GlycemicProfileDay => {
  return {
    id: createDayId(),

    date,

    measurements: GLYCEMIC_PROFILE_TIMES.map(createEmptyMeasurement),
  };
};

/*
 * Приводим старый гликемический профиль
 * к новой сетке из 24 часов.
 *
 * Старые данные не удаляются:
 * 06:00, 13:00, 17:00 и 21:00
 * попадают в соответствующие часы.
 *
 * Старое значение 24:00 переносим
 * в новый столбец 00:00.
 */
export const normalizeGlycemicProfileDay = (
  day: GlycemicProfileDay,
): GlycemicProfileDay => {
  const sourceMeasurements = Array.isArray(day.measurements)
    ? day.measurements
    : [];

  const normalizedMeasurements = GLYCEMIC_PROFILE_TIMES.map((time) => {
    const sourceMeasurement = sourceMeasurements.find(
      (measurement) => String(measurement.time) === time,
    );

    if (!sourceMeasurement) {
      return createEmptyMeasurement(time);
    }

    return {
      time,

      glycemia:
        typeof sourceMeasurement.glycemia === "number"
          ? sourceMeasurement.glycemia
          : null,

      insulinUnits:
        typeof sourceMeasurement.insulinUnits === "number"
          ? sourceMeasurement.insulinUnits
          : null,

      breadUnits:
        typeof sourceMeasurement.breadUnits === "number"
          ? sourceMeasurement.breadUnits
          : null,

      note:
        typeof sourceMeasurement.note === "string"
          ? sourceMeasurement.note
          : "",
    };
  });

  /*
   * В старой версии последний час
   * назывался 24:00.
   *
   * В новой таблице используем
   * стандартный диапазон 00:00–23:00.
   */
  const legacyMidnightMeasurement = sourceMeasurements.find(
    (measurement) => String(measurement.time) === "24:00",
  );

  if (legacyMidnightMeasurement) {
    const midnightMeasurement = normalizedMeasurements[0];

    if (midnightMeasurement.glycemia === null) {
      midnightMeasurement.glycemia =
        typeof legacyMidnightMeasurement.glycemia === "number"
          ? legacyMidnightMeasurement.glycemia
          : null;
    }

    if (midnightMeasurement.insulinUnits === null) {
      midnightMeasurement.insulinUnits =
        typeof legacyMidnightMeasurement.insulinUnits === "number"
          ? legacyMidnightMeasurement.insulinUnits
          : null;
    }

    if (!midnightMeasurement.note) {
      midnightMeasurement.note =
        typeof legacyMidnightMeasurement.note === "string"
          ? legacyMidnightMeasurement.note
          : "";
    }
  }

  return {
    ...day,

    measurements: normalizedMeasurements,
  };
};
