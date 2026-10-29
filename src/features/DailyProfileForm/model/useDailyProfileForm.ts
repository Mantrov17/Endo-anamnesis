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

type TargetRanges = DailyProfileDay["targetRanges"];

const AUTO_SAVE_DELAY_MS = 650;

const normalizeDays = (days: DailyProfileDay[]): DailyProfileDay[] =>
  days
    .map((day) => normalizeDailyProfileDay(structuredClone(day)))
    .sort((a, b) => a.date.localeCompare(b.date));

/*
 * Получаем исходные значения из модели,
 * чтобы не дублировать константы приложения.
 */
const getDefaultTargets = (): TargetRanges => ({
  ...createDailyProfileDay().targetRanges,
});

/*
 * Определяем, отличается ли диапазон
 * от стандартных значений.
 */
const isCustomTargets = (
  targets: TargetRanges,
  defaults: TargetRanges,
): boolean =>
  (Object.keys(defaults) as Array<keyof TargetRanges>).some(
    (key) => targets[key] !== defaults[key],
  );

/*
 * Одна настройка на все дни пациента.
 *
 * Совместимость со старыми данными:
 * если раньше разные дни содержали разные
 * значения, используем последние
 * нестандартные значения по дате.
 *
 * Данные измерений и инсулина не изменяем.
 */
const unifyPatientTargets = (days: DailyProfileDay[]): DailyProfileDay[] => {
  const normalized = normalizeDays(days);

  if (!normalized.length) {
    return normalized;
  }

  const defaults = getDefaultTargets();

  const latestCustomDay = [...normalized]
    .reverse()
    .find((day) => isCustomTargets(day.targetRanges, defaults));

  const commonTargets: TargetRanges = {
    ...defaults,
    ...(latestCustomDay?.targetRanges ??
      normalized[normalized.length - 1].targetRanges),
  };

  return normalized.map((day) => ({
    ...day,
    targetRanges: { ...commonTargets },
  }));
};

const shiftDate = (date: string, amount: number): string => {
  const value = new Date(`${date}T12:00:00`);

  value.setDate(value.getDate() + amount);

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
  /*
   * При первой загрузке синхронизируем
   * целевые диапазоны всех дней пациента.
   */
  const [days, setDays] = useState<DailyProfileDay[]>(() =>
    unifyPatientTargets(
      initialDays?.length ? initialDays : [createDailyProfileDay()],
    ),
  );

  const [selectedDayId, setSelectedDayId] = useState<string>(() => {
    if (!initialDays?.length) {
      return "";
    }

    const sorted = normalizeDays(initialDays);

    return sorted[sorted.length - 1]?.id ?? "";
  });

  const [autoSaveStatus, setAutoSaveStatus] =
    useState<DailyProfileAutoSaveStatus>("idle");

  /*
   * Последняя версия данных хранится в ref.
   * Это важно при быстром переключении
   * страницы и автосохранении.
   */
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

  /*
   * Значения диапазонов берём из общей
   * настройки, которая одинакова
   * для всех дней пациента.
   */
  const patientTargets = useMemo<TargetRanges>(
    () => days[0]?.targetRanges ?? getDefaultTargets(),
    [days],
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
   * Все изменения проходят через commitDays.
   *
   * Обновляем ref сразу, а не только после
   * очередного рендера. Так последние
   * изменения не теряются при уходе
   * со страницы.
   */
  const commitDays = (
    updater: (previous: DailyProfileDay[]) => DailyProfileDay[],
  ) => {
    const next = normalizeDays(updater(latestDaysRef.current));

    latestDaysRef.current = next;
    pendingRef.current = true;

    setDays(next);
    setAutoSaveStatus("saving");
  };

  /*
   * Автосохранение через 650 мс.
   *
   * Здесь нет синхронного setState
   * внутри тела эффекта.
   */
  useEffect(() => {
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
   * Последняя попытка сохранения
   * при закрытии вкладки или переходе.
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

  /*
   * Изменение данных выбранного дня.
   */
  const updateSelectedDay = (
    updater: (day: DailyProfileDay) => DailyProfileDay,
  ) => {
    if (!selectedDay) {
      return;
    }

    const currentId = selectedDay.id;

    commitDays((previous) =>
      previous.map((day) =>
        day.id === currentId ? updater(structuredClone(day)) : day,
      ),
    );
  };

  /*
   * Переключение даты.
   *
   * Если день уже существует, открываем его.
   * Если нет — создаём новый.
   *
   * Главное: новый день получает общие
   * целевые диапазоны этого пациента.
   */
  const updateSelectedDate = (date: string) => {
    if (!date) {
      return;
    }

    const currentDays = latestDaysRef.current;

    const existing = currentDays.find((day) => day.date === date);

    if (existing) {
      setSelectedDayId(existing.id);
      return;
    }

    const newDay = createDailyProfileDay(date);

    const currentTargets = currentDays[0]?.targetRanges ?? getDefaultTargets();

    const dayWithTargets: DailyProfileDay = {
      ...newDay,
      targetRanges: {
        ...currentTargets,
      },
    };

    commitDays((previous) => [...previous, dayWithTargets]);

    setSelectedDayId(dayWithTargets.id);
  };

  const goToAdjacentDate = (amount: number) => {
    if (!selectedDay) {
      return;
    }

    updateSelectedDate(shiftDate(selectedDay.date, amount));
  };

  /*
   * КЛЮЧЕВОЕ ИЗМЕНЕНИЕ.
   *
   * Целевые диапазоны обновляются
   * ОДНОВРЕМЕННО у всех дней пациента.
   *
   * Поэтому после изменения одного поля:
   * - текущий день обновляется;
   * - предыдущие дни обновляются;
   * - последующие дни обновляются;
   * - новые дни наследуют те же значения.
   */
  const updateTargets = (patch: Partial<TargetRanges>) => {
    commitDays((previous) => {
      const current = previous[0]?.targetRanges ?? getDefaultTargets();

      const nextTargets: TargetRanges = {
        ...current,
        ...patch,
      };

      return previous.map((day) => ({
        ...day,
        targetRanges: {
          ...nextTargets,
        },
      }));
    });
  };

  /*
   * Добавление измерений,
   * введений инсулина и питания.
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
   * Редактирование записей.
   *
   * Сохраняем существующие ID.
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
   * Удаление ошибочных записей.
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

    /*
     * Единые настройки пациента.
     */
    patientTargets,

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
