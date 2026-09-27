import { type FormEvent, useState } from "react";

import {
  createGlycemicProfileDay,
  type GlycemicProfileDay,
  saveGlycemicProfile,
} from "@/entities/glycemicProfile";

import { getStorageWriteErrorMessage } from "@/shared/lib/storage/jsonStorage";

interface UseGlycemicProfileFormProps {
  patientId: string;

  initialDays?: GlycemicProfileDay[];

  onSuccess?: () => void;
}

export const useGlycemicProfileForm = ({
  patientId,
  initialDays,
  onSuccess,
}: UseGlycemicProfileFormProps) => {
  const [days, setDays] = useState<GlycemicProfileDay[]>(() =>
    initialDays && initialDays.length > 0
      ? structuredClone(initialDays)
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
    measurementIndex: number,
    field: "glycemia" | "insulinUnits" | "note",
    value: number | null | string,
  ) => {
    setDays((previous) =>
      previous.map((day) => {
        if (day.id !== dayId) {
          return day;
        }

        return {
          ...day,

          measurements: day.measurements.map((measurement, index) =>
            index === measurementIndex
              ? {
                  ...measurement,

                  [field]: value,
                }
              : measurement,
          ),
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
