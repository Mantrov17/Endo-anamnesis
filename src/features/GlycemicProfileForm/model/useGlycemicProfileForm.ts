import { type FormEvent, useState } from "react";

import {
  createEmptyMeasurement,
  createGlycemicProfileDay,
  GLYCEMIC_PROFILE_TIMES,
  type GlycemicProfileDay,
  type GlycemicProfileMeasurement,
  type GlycemicProfileTime,
  normalizeGlycemicProfileDay,
  saveGlycemicProfile,
} from "@/entities/glycemicProfile";

import { getStorageWriteErrorMessage } from "@/shared/lib/storage/jsonStorage";

interface UseGlycemicProfileFormProps {
  patientId: string;
  initialDays?: GlycemicProfileDay[];
  onSuccess?: () => void;
}

type MeasurementField =
  | "glycemia"
  | "breadUnits"
  | "bolusInsulinUnits"
  | "basalInsulinUnits"
  | "insulinUnits"
  | "note";

const hasData = (measurement: GlycemicProfileMeasurement): boolean =>
  measurement.glycemia != null ||
  measurement.breadUnits != null ||
  measurement.bolusInsulinUnits != null ||
  measurement.basalInsulinUnits != null ||
  measurement.insulinUnits != null ||
  Boolean(measurement.note?.trim());

/**
 * В старых записях было 24 пустых часовых измерения.
 * Показываем только шесть основных времён и дополнительные
 * времена с данными или отметкой ручного добавления.
 */
const getVisibleTimes = (days: GlycemicProfileDay[]): GlycemicProfileTime[] => {
  const times = new Set<GlycemicProfileTime>(GLYCEMIC_PROFILE_TIMES);

  for (const day of days) {
    for (const measurement of day.measurements) {
      if (measurement.isCustom || hasData(measurement)) {
        times.add(measurement.time);
      }
    }
  }

  return Array.from(times).sort((a, b) => a.localeCompare(b));
};

export const useGlycemicProfileForm = ({
  patientId,
  initialDays,
  onSuccess,
}: UseGlycemicProfileFormProps) => {
  const [days, setDays] = useState<GlycemicProfileDay[]>(() =>
    initialDays && initialDays.length > 0
      ? initialDays.map((day) =>
          normalizeGlycemicProfileDay(structuredClone(day)),
        )
      : [createGlycemicProfileDay()],
  );

  const [loading, setLoading] = useState(false);

  const times = getVisibleTimes(days);

  const addDay = () => {
    const additionalTimes = times.filter(
      (time) => !GLYCEMIC_PROFILE_TIMES.includes(time),
    );

    const newDay = createGlycemicProfileDay();

    newDay.measurements.push(
      ...additionalTimes.map((time) => createEmptyMeasurement(time, true)),
    );

    setDays((previous) => [...previous, newDay]);
  };

  const removeDay = (dayId: string) => {
    setDays((previous) => previous.filter((day) => day.id !== dayId));
  };

  const updateDayDate = (dayId: string, date: string) => {
    setDays((previous) =>
      previous.map((day) => (day.id === dayId ? { ...day, date } : day)),
    );
  };

  const addTime = (time: string): boolean => {
    const validTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);

    if (!validTime || times.includes(time)) {
      return false;
    }

    setDays((previous) =>
      previous.map((day) => {
        const exists = day.measurements.some(
          (measurement) => measurement.time === time,
        );

        return {
          ...day,
          measurements: exists
            ? day.measurements.map((measurement) =>
                measurement.time === time
                  ? { ...measurement, isCustom: true }
                  : measurement,
              )
            : [...day.measurements, createEmptyMeasurement(time, true)],
        };
      }),
    );

    return true;
  };

  const updateMeasurement = (
    dayId: string,
    time: GlycemicProfileTime,
    field: MeasurementField,
    value: number | null | string,
  ) => {
    setDays((previous) =>
      previous.map((day) => {
        if (day.id !== dayId) {
          return day;
        }

        const numericValue =
          value === null || value === ""
            ? null
            : typeof value === "number"
              ? value
              : Number(value);

        const applyValue = (measurement: GlycemicProfileMeasurement) =>
          field === "note"
            ? { ...measurement, note: typeof value === "string" ? value : "" }
            : {
                ...measurement,
                [field]:
                  numericValue !== null && Number.isFinite(numericValue)
                    ? numericValue
                    : null,
              };

        const existing = day.measurements.some(
          (measurement) => measurement.time === time,
        );

        return {
          ...day,
          measurements: existing
            ? day.measurements.map((measurement) =>
                measurement.time === time
                  ? applyValue(measurement)
                  : measurement,
              )
            : [
                ...day.measurements,
                applyValue(createEmptyMeasurement(time, true)),
              ],
        };
      }),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const success = saveGlycemicProfile(patientId, days);

      if (!success) {
        window.alert("Пациент не найден");
        return;
      }

      onSuccess?.();
    } catch (error) {
      console.error("Ошибка сохранения гликемического профиля:", error);
      window.alert(getStorageWriteErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const hasLegacyInsulin = days.some((day) =>
    day.measurements.some((measurement) => measurement.insulinUnits != null),
  );

  return {
    days,
    times,
    loading,
    hasLegacyInsulin,
    addDay,
    removeDay,
    updateDayDate,
    addTime,
    updateMeasurement,
    handleSubmit,
  };
};
