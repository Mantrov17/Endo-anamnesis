import { type FormEvent, useState } from "react";

import { createPatient, type PatientFormData, updatePatient } from "@/shared";

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
          throw new Error("Patient not found");
        }
      } else {
        createPatient(formData);
      }

      onSuccess?.();
    } catch (_error) {
      window.alert("Ошибка сохранения");
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
