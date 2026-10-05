import React from "react";

import type { PlanFormData } from "@/entities/plan";

import { Button } from "@/shared/ui/Button";

import { DateInput } from "@/shared/ui/DateInput";

import { Textarea } from "@/shared/ui/Textarea";

import { usePlanForm } from "../model/usePlanForm";

import styles from "./styles.module.scss";

interface PlanFormProps {
  patientId: string;

  planId?: string;

  initialData?: PlanFormData;

  onSuccess?: () => void;

  onCancelEdit?: () => void;
}

export const PlanForm: React.FC<PlanFormProps> = ({
  patientId,
  planId,
  initialData,
  onSuccess,
  onCancelEdit,
}) => {
  const { formData, loading, updateField, handleSubmit } = usePlanForm({
    patientId,
    planId,
    initialData,
    onSuccess,
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <DateInput
          label="Дата"
          value={formData.date}
          onChange={(value) => updateField("date", value)}
        />

        <Textarea
          label="План"
          value={formData.text}
          onChange={(event) => updateField("text", event.target.value)}
          rows={3}
        />
      </div>

      <div className={styles.actions}>
        {planId && onCancelEdit && (
          <Button type="button" variant="secondary" onClick={onCancelEdit}>
            Отмена
          </Button>
        )}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? "Сохранение..."
            : planId
              ? "Сохранить изменения"
              : "+ Добавить план"}
        </Button>
      </div>
    </form>
  );
};
