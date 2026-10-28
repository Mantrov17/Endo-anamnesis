import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createDailyProfileDay,
  createDailyProfileGlucoseEntry,
  createDailyProfileInsulinEntry,
  createDailyProfileMealEntry,
  normalizeDailyProfileDay,
  saveDailyProfile,
  type DailyProfileDay,
  type DailyProfileGlucoseEntry,
  type DailyProfileInsulinEntry,
  type DailyProfileInsulinName,
  type DailyProfileMealEntry,
  type DailyProfileMealType,
} from "@/entities/dailyProfile";

interface UseDailyProfileFormProps {
  patientId: string;
  initialDays?: DailyProfileDay[];
  onSuccess?: () => void;
}

interface AddEntriesPayload {
  time: string;
  addGlucose: boolean;
  glucoseValue: number | null;
  glucoseNote: string;
  addInsulin: boolean;
  insulinName: DailyProfileInsulinName;
  insulinUnits: number | null;
  insulinNote: string;
  addMeal: boolean;
  breadUnits: number | null;
  mealType: DailyProfileMealType;
  mealNote: string;
}

export type DailyProfileAutoSaveStatus = "idle" | "saving" | "saved" | "error";

const AUTO_SAVE_DELAY_MS = 650;

const normalizeDays = (days: DailyProfileDay[]): DailyProfileDay[] =>
  days
    .map((day) => normalizeDailyProfileDay(structuredClone(day)))
    .sort((a, b) => a.date.localeCompare(b.date));

const shiftDate = (date: string, days: number): string => {
  const value = new Date(`${date}T12:00:00`);

  value.setDate(value.getDate() + days);

  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0"),
  ].join("-");
};

export const useDailyProfileForm = ({
  patientId,
  initialDays,
  onSuccess,
}: UseDailyProfileFormProps) => {
  const [days, setDays] = useState<DailyProfileDay[]>(() =>
    initialDays?.length
      ? normalizeDays(initialDays)
      : [createDailyProfileDay()],
  );

  const [selectedDayId, setSelectedDayId] = useState<string>(() =>
    initialDays?.length ? (normalizeDays(initialDays).at(-1)?.id ?? "") : "",
  );

  const [autoSaveStatus, setAutoSaveStatus] =
    useState<DailyProfileAutoSaveStatus>("idle");

  const latestDaysRef = useRef(days);
  const pendingRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const selectedDay = useMemo(
    () => days.find((day) => day.id === selectedDayId) ?? days[0] ?? null,
    [days, selectedDayId],
  );

  const saveNow = useCallback(
    (notify = false, updateStatus = true): boolean => {
      if (!pendingRef.current && !notify) {
        return true;
      }

      try {
        const successful = saveDailyProfile(
          patientId,
          normalizeDays(latestDaysRef.current),
        );

        if (!successful) {
          throw new Error("Пациент не найден");
        }

        pendingRef.current = false;

        if (updateStatus) {
          setAutoSaveStatus("saved");
        }

        if (notify) {
          onSuccessRef.current?.();
        }

        return true;
      } catch (error) {
        console.error("Не удалось сохранить суточный профиль:", error);

        if (updateStatus) {
          setAutoSaveStatus("error");
        }

        return false;
      }
    },
    [patientId],
  );

  /*
   * Автосохранение после изменения данных.
   *
   * Синхронных вызовов setState внутри
   * эффекта нет.
   */
  useEffect(() => {
    latestDaysRef.current = days;

    if (!pendingRef.current) {
      return;
    }

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      saveNow();
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [days, saveNow]);

  /*
   * Дополнительная попытка сохранения
   * при закрытии страницы или уходе
   * на другую страницу приложения.
   */
  useEffect(() => {
    const flush = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (pendingRef.current) {
        saveNow(false, false);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flush();
      }
    };

    window.addEventListener("pagehide", flush);

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", flush);

      document.removeEventListener("visibilitychange", onVisibilityChange);

      flush();
    };
  }, [saveNow]);

  const markDirty = () => {
    pendingRef.current = true;
    setAutoSaveStatus("saving");
  };

  /*
   * Все действия с данными проходят
   * через updateSelectedDay.
   *
   * Благодаря этому добавление,
   * редактирование и удаление вызывают
   * одно и то же автосохранение.
   */
  const updateSelectedDay = (
    updater: (day: DailyProfileDay) => DailyProfileDay,
  ) => {
    if (!selectedDay) {
      return;
    }

    const id = selectedDay.id;

    markDirty();

    setDays((previous) =>
      normalizeDays(
        previous.map((day) =>
          day.id === id ? updater(structuredClone(day)) : day,
        ),
      ),
    );
  };

  const updateSelectedDate = (date: string) => {
    if (!date || !selectedDay) {
      return;
    }

    const existing = days.find((day) => day.date === date);

    if (existing) {
      setSelectedDayId(existing.id);
      return;
    }

    const newDay = createDailyProfileDay(date);

    markDirty();

    setDays((previous) => normalizeDays([...previous, newDay]));

    setSelectedDayId(newDay.id);
  };

  const goToAdjacentDate = (amount: number) => {
    if (selectedDay) {
      updateSelectedDate(shiftDate(selectedDay.date, amount));
    }
  };

  const updateTargets = (patch: Partial<DailyProfileDay["targetRanges"]>) => {
    updateSelectedDay((day) => ({
      ...day,
      targetRanges: {
        ...day.targetRanges,
        ...patch,
      },
    }));
  };

  /*
   * Добавление глюкозы, инсулина
   * и питания.
   */
  const addLinkedEntries = (payload: AddEntriesPayload) => {
    updateSelectedDay((day) => {
      if (payload.addGlucose) {
        day.glucoseEntries.push({
          ...createDailyProfileGlucoseEntry(payload.time),
          value: payload.glucoseValue,
          note: payload.glucoseNote,
        });
      }

      if (payload.addInsulin) {
        day.insulinEntries.push({
          ...createDailyProfileInsulinEntry(payload.time),
          insulinName: payload.insulinName,
          units: payload.insulinUnits,
          note: payload.insulinNote,
        });
      }

      if (payload.addMeal) {
        day.mealEntries.push({
          ...createDailyProfileMealEntry(payload.time),
          breadUnits: payload.breadUnits,
          mealType: payload.mealType,
          note: payload.mealNote,
        });
      }

      return day;
    });
  };

  /*
   * Редактирование существующих записей.
   *
   * ID сохраняется, поэтому запись
   * не нужно удалять и создавать заново.
   */
  const updateGlucoseEntry = (
    id: string,
    patch: Partial<Pick<DailyProfileGlucoseEntry, "time" | "value" | "note">>,
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      glucoseEntries: day.glucoseEntries.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    }));
  };

  const updateInsulinEntry = (
    id: string,
    patch: Partial<
      Pick<DailyProfileInsulinEntry, "time" | "insulinName" | "units">
    >,
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      insulinEntries: day.insulinEntries.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    }));
  };

  const updateMealEntry = (
    id: string,
    patch: Partial<
      Pick<DailyProfileMealEntry, "time" | "mealType" | "breadUnits">
    >,
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      mealEntries: day.mealEntries.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    }));
  };

  /*
   * Удаление записей.
   */
  const deleteGlucoseEntry = (id: string) => {
    updateSelectedDay((day) => ({
      ...day,
      glucoseEntries: day.glucoseEntries.filter((entry) => entry.id !== id),
    }));
  };

  const deleteInsulinEntry = (id: string) => {
    updateSelectedDay((day) => ({
      ...day,
      insulinEntries: day.insulinEntries.filter((entry) => entry.id !== id),
    }));
  };

  const deleteMealEntry = (id: string) => {
    updateSelectedDay((day) => ({
      ...day,
      mealEntries: day.mealEntries.filter((entry) => entry.id !== id),
    }));
  };

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!saveNow(true)) {
      window.alert(
        "Не удалось сохранить профиль. Проверьте хранилище браузера.",
      );
    }
  };

  return {
    days,
    selectedDay,
    selectedDayId,
    autoSaveStatus,

    updateSelectedDate,
    goToPreviousDate: () => goToAdjacentDate(-1),
    goToNextDate: () => goToAdjacentDate(1),

    updateTargets,
    addLinkedEntries,

    updateGlucoseEntry,
    updateInsulinEntry,
    updateMealEntry,

    deleteGlucoseEntry,
    deleteInsulinEntry,
    deleteMealEntry,

    handleSubmit,
  };
};
