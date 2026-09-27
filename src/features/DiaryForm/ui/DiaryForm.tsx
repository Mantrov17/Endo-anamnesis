import React from "react";

import type { DiaryFormData } from "@/entities/diary";

import { Button } from "@/shared/ui/Button";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { useDiaryForm } from "../model/useDiaryForm";

import styles from "./styles.module.scss";

interface DiaryFormProps {
  patientId: string;

  diaryId?: string;

  initialData?: DiaryFormData;

  onSuccess?: (diaryId: string) => void;
}

export const DiaryForm: React.FC<DiaryFormProps> = ({
  patientId,
  diaryId,
  initialData,
  onSuccess,
}) => {
  const { formData, currentDiaryId, loading, updateField, handleSubmit } =
    useDiaryForm({
      patientId,
      diaryId,
      initialData,
      onSuccess,
    });

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formSurface}>
        <div className={styles.content}>
          <div className={styles.field}>
            <Textarea
              label="Жалобы"
              value={formData.complaints}
              onChange={(event) =>
                updateField("complaints", event.target.value)
              }
              rows={4}
            />
          </div>

          <div className={styles.field}>
            <Input
              label="АД"
              placeholder="Например: 120/80"
              suffix="мм рт. ст."
              value={formData.bloodPressure}
              onChange={(event) =>
                updateField("bloodPressure", event.target.value)
              }
            />
          </div>

          <div className={styles.field}>
            <Input
              label="Сатурация"
              type="number"
              min={0}
              max={100}
              step={1}
              suffix="%"
              value={formData.saturation ?? ""}
              onChange={(event) =>
                updateField(
                  "saturation",
                  event.target.value === "" ? null : Number(event.target.value),
                )
              }
            />
          </div>

          <div className={styles.field}>
            <Textarea
              label="Отеки"
              value={formData.edema}
              onChange={(event) => updateField("edema", event.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <Textarea
              label="Планируемые на день мероприятия"
              value={formData.plannedActivities}
              onChange={(event) =>
                updateField("plannedActivities", event.target.value)
              }
              rows={4}
            />
          </div>

          <div className={styles.field}>
            <Textarea
              label="Другие данные"
              value={formData.otherData}
              onChange={(event) => updateField("otherData", event.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? "Сохранение..."
            : currentDiaryId
              ? "Сохранить изменения"
              : "Сохранить дневник"}
        </Button>
      </div>
    </form>
  );
};
