import { type FormEvent, useEffect, useState } from "react";

import {
  addDiary,
  type DiaryFormData,
  getTodayLocalDate,
  updateDiary,
} from "@/entities/diary";

import { getStorageWriteErrorMessage } from "@/shared/lib/storage/jsonStorage";

interface UseDiaryFormProps {
  patientId: string;

  diaryId?: string;

  initialData?: DiaryFormData;

  onSuccess?: (diaryId: string) => void;
}

const createEmptyDiary = (): DiaryFormData => ({
  date: getTodayLocalDate(),

  complaints: "",

  bloodPressure: "",

  pulse: null,

  saturation: null,

  ketoneStripPerformed: null,

  ketoneStripResult: null,

  edema: "",

  otherData: "",

  performedActivities: "",
});

export const useDiaryForm = ({
  patientId,
  diaryId,
  initialData,
  onSuccess,
}: UseDiaryFormProps) => {
  const [formData, setFormData] = useState<DiaryFormData>(() =>
    initialData
      ? {
          ...initialData,

          performedActivities: initialData.performedActivities ?? "",

          ketoneStripPerformed: initialData.ketoneStripPerformed ?? null,

          ketoneStripResult: initialData.ketoneStripResult ?? null,
        }
      : createEmptyDiary(),
  );

  const [currentDiaryId, setCurrentDiaryId] = useState<string | undefined>(
    diaryId,
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (diaryId) {
      setCurrentDiaryId(diaryId);
    }
  }, [diaryId]);

  const updateField = <K extends keyof DiaryFormData>(
    field: K,
    value: DiaryFormData[K],
  ) => {
    setFormData((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  /*
   * Переключение факта проведения теста.
   *
   * Если выбрано "Не проводился",
   * предыдущий результат обязательно очищается.
   *
   * Изменяем оба поля одним обновлением состояния,
   * чтобы не возникало рассинхронизации.
   */
  const updateKetoneStripPerformed = (performed: boolean) => {
    setFormData((previous) => ({
      ...previous,

      ketoneStripPerformed: performed,

      ketoneStripResult: performed
        ? (previous.ketoneStripResult ?? null)
        : null,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.date) {
      window.alert("Укажите дату дневника.");

      return;
    }

    setLoading(true);

    try {
      if (currentDiaryId) {
        const success = updateDiary(patientId, currentDiaryId, formData);

        if (!success) {
          window.alert("Дневник не найден. Возможно, он был удалён.");

          return;
        }

        onSuccess?.(currentDiaryId);

        return;
      }

      const diary = addDiary(patientId, formData);

      if (!diary) {
        window.alert("Пациент не найден");

        return;
      }

      setCurrentDiaryId(diary.id);

      onSuccess?.(diary.id);
    } catch (error) {
      console.error("Ошибка сохранения дневника:", error);

      window.alert(getStorageWriteErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    currentDiaryId,
    loading,

    updateField,
    updateKetoneStripPerformed,
    handleSubmit,
  };
};
