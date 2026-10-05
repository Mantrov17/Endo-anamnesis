import { type FormEvent, useState } from "react";

import { addPlan, type PlanFormData, updatePlan } from "@/entities/plan";

import { getStorageWriteErrorMessage } from "@/shared/lib/storage/jsonStorage";

interface UsePlanFormProps {
  patientId: string;

  planId?: string;

  initialData?: PlanFormData;

  onSuccess?: () => void;
}

const getTodayLocalDate = (): string => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const createEmptyPlan = (): PlanFormData => ({
  date: getTodayLocalDate(),

  time: "",

  text: "",
});

export const usePlanForm = ({
  patientId,
  planId,
  initialData,
  onSuccess,
}: UsePlanFormProps) => {
  const [formData, setFormData] = useState<PlanFormData>(
    initialData
      ? {
          ...initialData,
        }
      : createEmptyPlan(),
  );

  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof PlanFormData>(
    field: K,
    value: PlanFormData[K],
  ) => {
    setFormData((previous) => ({
      ...previous,

      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.date) {
      window.alert("Укажите дату плана.");

      return;
    }

    if (!formData.time) {
      window.alert("Укажите время плана.");

      return;
    }

    if (!formData.text.trim()) {
      window.alert("Введите текст плана.");

      return;
    }

    setLoading(true);

    try {
      const payload: PlanFormData = {
        ...formData,

        text: formData.text.trim(),
      };

      if (planId) {
        const success = updatePlan(patientId, planId, payload);

        if (!success) {
          window.alert("План не найден.");

          return;
        }

        onSuccess?.();

        return;
      }

      const plan = addPlan(patientId, payload);

      if (!plan) {
        window.alert("Пациент не найден.");

        return;
      }

      setFormData(createEmptyPlan());

      onSuccess?.();
    } catch (error) {
      console.error("Ошибка сохранения плана:", error);

      window.alert(getStorageWriteErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,

    updateField,
    handleSubmit,
  };
};
