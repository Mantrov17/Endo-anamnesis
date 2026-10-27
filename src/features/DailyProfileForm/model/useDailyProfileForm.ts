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
  type DailyProfileInsulinName,
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

export type DailyProfileAutoSaveStatus = "idle" | "saved" | "saving" | "error";

const AUTO_SAVE_DELAY_MS = 650;

const sortDays = (days: DailyProfileDay[]): DailyProfileDay[] =>
  [...days].sort((a, b) => a.date.localeCompare(b.date));

const normalizeDays = (days: DailyProfileDay[]): DailyProfileDay[] =>
  sortDays(days.map((day) => normalizeDailyProfileDay(structuredClone(day))));

const shiftDate = (date: string, offset: number): string => {
  const value = new Date(`${date}T12:00:00`);

  value.setDate(value.getDate() + offset);

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

  const [selectedDayId, setSelectedDayId] = useState(() => {
    const initial = initialDays?.length ? sortDays(initialDays) : null;

    return initial?.[initial.length - 1]?.id ?? "";
  });

  const [autoSaveStatus, setAutoSaveStatus] =
    useState<DailyProfileAutoSaveStatus>("idle");

  const [loading, setLoading] = useState(false);

  /*
   * Храним последние данные в ref.
   *
   * Это позволяет сохранить изменения
   * даже при закрытии страницы до
   * окончания задержки автосохранения.
   */
  const latestDaysRef = useRef(days);
  latestDaysRef.current = days;

  const hasPendingChangesRef = useRef(false);
  const didMountRef = useRef(false);

  const callbackRef = useRef(onSuccess);
  callbackRef.current = onSuccess;

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sortedDays = useMemo(() => sortDays(days), [days]);

  const selectedDay = useMemo(
    () =>
      sortedDays.find((day) => day.id === selectedDayId) ??
      sortedDays[0] ??
      null,
    [selectedDayId, sortedDays],
  );

  /*
   * Единая функция сохранения.
   *
   * Автосохранение использует её без
   * всплывающего уведомления.
   *
   * Ручное сохранение при отправке
   * формы остаётся запасным механизмом.
   */
  const saveNow = useCallback(
    (notify = false, updateStatus = true): boolean => {
      if (!hasPendingChangesRef.current && !notify) {
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

        hasPendingChangesRef.current = false;

        if (updateStatus) {
          setAutoSaveStatus("saved");
        }

        if (notify) {
          callbackRef.current?.();
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
   * Автоматическое сохранение.
   *
   * При каждом изменении days:
   * 1. Отменяется предыдущий таймер.
   * 2. Отмечается наличие несохранённых данных.
   * 3. Через 650 мс выполняется сохранение.
   *
   * Первую загрузку существующего
   * профиля повторно не сохраняем.
   */
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    hasPendingChangesRef.current = true;
    setAutoSaveStatus("saving");

    autoSaveTimerRef.current = setTimeout(() => {
      autoSaveTimerRef.current = null;
      saveNow();
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      if (autoSaveTimerRef.current !== null) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [days, saveNow]);

  /*
   * Сохранение при уходе со страницы.
   *
   * Используется и при переключении
   * вкладок браузера, и при размонтировании
   * компонента через React Router.
   */
  useEffect(() => {
    const flush = () => {
      if (autoSaveTimerRef.current !== null) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }

      if (hasPendingChangesRef.current) {
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

  /*
   * Изменение выбранного дня.
   */
  const updateSelectedDay = (
    updater: (day: DailyProfileDay) => DailyProfileDay,
  ) => {
    if (!selectedDay) {
      return;
    }

    setDays((previous) =>
      normalizeDays(
        previous.map((day) =>
          day.id === selectedDay.id ? updater(structuredClone(day)) : day,
        ),
      ),
    );
  };

  const selectDay = (dayId: string) => {
    setSelectedDayId(dayId);
  };

  /*
   * Выбор даты.
   *
   * Не переносим записи текущего дня
   * на новую дату!
   *
   * Открываем существующий профиль
   * или создаём новый пустой день.
   */
  const updateSelectedDate = (date: string) => {
    if (!date || !selectedDay) {
      return;
    }

    const exists = sortedDays.find((day) => day.date === date);

    if (exists) {
      setSelectedDayId(exists.id);
      return;
    }

    const newDay = createDailyProfileDay(date);

    setDays((previous) => normalizeDays([...previous, newDay]));

    setSelectedDayId(newDay.id);
  };

  const goToAdjacentDate = (offset: number) => {
    if (selectedDay) {
      updateSelectedDate(shiftDate(selectedDay.date, offset));
    }
  };

  /*
   * Целевые диапазоны.
   */
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
   * Добавление связанных записей.
   *
   * Глюкоза, инсулин и питание могут
   * добавляться одновременно.
   */
  const addLinkedEntries = (payload: AddEntriesPayload) => {
    updateSelectedDay((day) => {
      const next = structuredClone(day);

      if (payload.addGlucose) {
        next.glucoseEntries.push({
          ...createDailyProfileGlucoseEntry(payload.time),
          value: payload.glucoseValue,
          note: payload.glucoseNote,
        });
      }

      if (payload.addInsulin) {
        next.insulinEntries.push({
          ...createDailyProfileInsulinEntry(payload.time),
          insulinName: payload.insulinName,
          units: payload.insulinUnits,
          note: payload.insulinNote,
        });
      }

      if (payload.addMeal) {
        next.mealEntries.push({
          ...createDailyProfileMealEntry(payload.time),
          breadUnits: payload.breadUnits,
          mealType: payload.mealType,
          note: payload.mealNote,
        });
      }

      return next;
    });
  };

  /*
   * Удаление ошибочных записей.
   *
   * Каждое удаление меняет days,
   * поэтому тоже запускает автосохранение.
   */
  const deleteGlucoseEntry = (entryId: string) =>
    updateSelectedDay((day) => ({
      ...day,
      glucoseEntries: day.glucoseEntries.filter(
        (entry) => entry.id !== entryId,
      ),
    }));

  const deleteInsulinEntry = (entryId: string) =>
    updateSelectedDay((day) => ({
      ...day,
      insulinEntries: day.insulinEntries.filter(
        (entry) => entry.id !== entryId,
      ),
    }));

  const deleteMealEntry = (entryId: string) =>
    updateSelectedDay((day) => ({
      ...day,
      mealEntries: day.mealEntries.filter((entry) => entry.id !== entryId),
    }));

  /*
   * Запасное сохранение при отправке формы
   * клавишей Enter.
   */
  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    setLoading(true);

    const successful = saveNow(true);

    if (!successful) {
      window.alert(
        "Сохранение не удалось. Проверьте свободное место браузера.",
      );
    }

    setLoading(false);
  };

  return {
    days: sortedDays,
    selectedDay,
    selectedDayId,

    loading,
    autoSaveStatus,

    selectDay,
    updateSelectedDate,

    goToPreviousDate: () => goToAdjacentDate(-1),
    goToNextDate: () => goToAdjacentDate(1),

    updateTargets,
    addLinkedEntries,

    deleteGlucoseEntry,
    deleteInsulinEntry,
    deleteMealEntry,

    handleSubmit,
  };
};
