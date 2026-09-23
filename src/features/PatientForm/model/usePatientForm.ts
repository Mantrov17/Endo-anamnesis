import { type FormEvent, useState } from "react";

import {
  createPatient,
  type PatientFormData,
  updatePatient,
} from "@/entities/patient";

import { getStorageWriteErrorMessage } from "@/shared/lib/storage/jsonStorage";

interface UsePatientFormProps {
  patientId?: string;

  initialData?: PatientFormData;

  onSuccess?: () => void;
}

const createEmptyPatientFormData = (): PatientFormData => ({
  fullName: "",
  birthDate: "",
  gender: "male",
});

export const usePatientForm = ({
  patientId,
  initialData,
  onSuccess,
}: UsePatientFormProps) => {
  const [formData, setFormData] = useState<PatientFormData>(() =>
    initialData
      ? {
          ...initialData,
        }
      : createEmptyPatientFormData(),
  );

  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof PatientFormData>(
    name: K,
    value: PatientFormData[K],
  ) => {
    setFormData((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    try {
      if (patientId) {
        const success = updatePatient(patientId, formData);

        if (!success) {
          window.alert("Пациент не найден. Возможно, он был удалён.");

          return;
        }
      } else {
        createPatient(formData);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Ошибка сохранения пациента:", error);

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
