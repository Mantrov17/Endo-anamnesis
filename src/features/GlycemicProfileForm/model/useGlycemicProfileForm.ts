import { type FormEvent, useState } from "react";

import {
  createGlycemicProfileDay,
  type GlycemicProfileDay,
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

type MeasurementField = "glycemia" | "insulinUnits" | "breadUnits" | "note";

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

  const addDay = () => {
    setDays((previous) => [...previous, createGlycemicProfileDay()]);
  };

  const removeDay = (dayId: string) => {
    setDays((previous) => previous.filter((day) => day.id !== dayId));
  };

  const updateDayDate = (dayId: string, date: string) => {
    setDays((previous) =>
      previous.map((day) =>
        day.id === dayId
          ? {
              ...day,

              date,
            }
          : day,
      ),
    );
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

        return {
          ...day,

          measurements: day.measurements.map((measurement) => {
            if (measurement.time !== time) {
              return measurement;
            }

            if (field === "note") {
              return {
                ...measurement,

                note: typeof value === "string" ? value : "",
              };
            }

            const numericValue =
              value === null
                ? null
                : typeof value === "number"
                  ? value
                  : Number(value);

            return {
              ...measurement,

              [field]:
                numericValue !== null && Number.isFinite(numericValue)
                  ? numericValue
                  : null,
            };
          }),
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

  return {
    days,
    loading,

    addDay,
    removeDay,
    updateDayDate,
    updateMeasurement,
    handleSubmit,
  };
};
