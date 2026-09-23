import React from "react";

import type { PatientFormData } from "@/entities/patient";

import { Button } from "@/shared/ui/Button";
import { DateInput } from "@/shared/ui/DateInput";
import { Input } from "@/shared/ui/Input";
import { RadioGroup } from "@/shared/ui/RadioGroup";

import { usePatientForm } from "../model/usePatientForm";

import styles from "./styles.module.scss";

interface PatientFormProps {
  patientId?: string;

  initialData?: PatientFormData;

  onSuccess?: () => void;

  onCancel?: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patientId,
  initialData,
  onSuccess,
  onCancel,
}) => {
  const { formData, loading, updateField, handleSubmit } = usePatientForm({
    patientId,
    initialData,
    onSuccess,
  });

  const gender = formData.gender ?? "male";

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="ФИО"
        name="fullName"
        value={formData.fullName}
        onChange={(event) => updateField("fullName", event.target.value)}
        required
      />

      <DateInput
        label="Дата рождения (необязательно)"
        value={formData.birthDate}
        onChange={(iso) => updateField("birthDate", iso)}
      />

      <RadioGroup
        label="Пол"
        name="gender"
        value={gender}
        onChange={(value) =>
          updateField("gender", value === "female" ? "female" : "male")
        }
        options={[
          {
            value: "male",
            label: "Мужской",
          },
          {
            value: "female",
            label: "Женский",
          },
        ]}
      />

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
};
