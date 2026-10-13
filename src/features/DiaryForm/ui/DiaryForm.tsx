import React, { useMemo } from "react";

import type { DiaryFormData, DiaryRecord } from "@/entities/diary";

import { getPlansByDate } from "@/entities/plan";

import { Button } from "@/shared/ui/Button";

import { DateInput } from "@/shared/ui/DateInput";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { useDiaryForm } from "../model/useDiaryForm";

import styles from "./styles.module.scss";

const formatShortDate = (date: string): string => {
  const [year, month, day] = date.split("-");

  return year && month && day ? `${day}.${month}.${year}` : date;
};

interface DiaryFormProps {
  patientId: string;

  diaryId?: string;

  initialData?: DiaryFormData;

  diaryEntries: DiaryRecord[];

  onSuccess?: (diaryId: string) => void;
}

export const DiaryForm: React.FC<DiaryFormProps> = ({
  patientId,
  diaryId,
  initialData,
  diaryEntries,
  onSuccess,
}) => {
  const { formData, currentDiaryId, loading, updateField, handleSubmit } =
    useDiaryForm({
      patientId,
      diaryId,
      initialData,
      onSuccess,
    });

  const plansForDate = useMemo(
    () => getPlansByDate(patientId, formData.date),
    [patientId, formData.date],
  );

  /*
   * Показываем последнюю содержательную запись строго раньше даты
   * текущего дневника, а не последнюю по порядку создания.
   * Другие данные используем только для старых дневников без нового поля.
   */
  const previousDiary = useMemo(() => {
    if (!formData.date) {
      return undefined;
    }

    return [...diaryEntries]
      .filter(
        (entry) =>
          entry.id !== currentDiaryId &&
          entry.date < formData.date &&
          Boolean(entry.performedActivities?.trim() || entry.otherData?.trim()),
      )
      .sort(
        (first, second) =>
          second.date.localeCompare(first.date) ||
          second.updatedAt.localeCompare(first.updatedAt),
      )[0];
  }, [diaryEntries, currentDiaryId, formData.date]);

  const previousIsActivities = Boolean(
    previousDiary?.performedActivities?.trim(),
  );

  const previousText = previousIsActivities
    ? (previousDiary?.performedActivities?.trim() ?? "")
    : (previousDiary?.otherData?.trim() ?? "");

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formSurface}>
        <div className={styles.content}>
          <div className={styles.field}>
            <DateInput
              label="Дата дневника"
              value={formData.date}
              onChange={(date) => updateField("date", date)}
              disabled={Boolean(currentDiaryId)}
            />
          </div>

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
              label="Пульс"
              type="number"
              min={0}
              step={1}
              suffix="уд/мин"
              value={formData.pulse ?? ""}
              onChange={(event) =>
                updateField(
                  "pulse",
                  event.target.value === "" ? null : Number(event.target.value),
                )
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
              label="Отёки"
              value={formData.edema}
              onChange={(event) => updateField("edema", event.target.value)}
              rows={3}
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

          <div className={styles.field}>
            {previousDiary && (
              <details className={styles.previousActivities}>
                <summary className={styles.previousActivitiesSummary}>
                  <span className={styles.previousActivitiesHeading}>
                    <span className={styles.previousActivitiesTitle}>
                      Предыдущая запись · {formatShortDate(previousDiary.date)}
                    </span>
                    <span className={styles.previousActivitiesAction}>
                      Подробнее
                    </span>
                  </span>

                  {!previousIsActivities && (
                    <span className={styles.previousActivitiesSource}>
                      Из поля «Другие данные»
                    </span>
                  )}

                  <span className={styles.previousActivitiesPreview}>
                    {previousText}
                  </span>
                </summary>

                <div className={styles.previousActivitiesFull}>
                  {previousText}
                </div>
              </details>
            )}

            <Textarea
              label={`Проведённые мероприятия ${formatShortDate(formData.date)}`}
              value={formData.performedActivities ?? ""}
              onChange={(event) =>
                updateField("performedActivities", event.target.value)
              }
              rows={3}
            />
          </div>
        </div>
      </div>

      <section className={styles.plansSection}>
        <div className={styles.plansHeader}>
          <h3>Планы на эту дату</h3>

          <span>{plansForDate.length}</span>
        </div>

        {plansForDate.length === 0 ? (
          <div className={styles.plansEmpty}>На эту дату планов нет</div>
        ) : (
          <div className={styles.plansList}>
            {plansForDate.map((plan) => (
              <div key={plan.id} className={styles.planItem}>
                {plan.text}
              </div>
            ))}
          </div>
        )}
      </section>

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
