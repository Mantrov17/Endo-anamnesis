import React from "react";

import { useNavigate } from "react-router-dom";

import { type DiaryRecord, formatDiaryTitle } from "@/entities/diary";

import { Button } from "@/shared/ui/Button";

import { Heading } from "@/shared/ui/Heading";

import styles from "../styles.module.scss";

interface PatientDiariesProps {
  patientId: string;

  diaryEntries: DiaryRecord[];

  onAdd: (patientId: string) => void;

  onEdit: (patientId: string, diaryId: string) => void;

  onDelete: (patientId: string, diaryId: string) => void;
}

export const PatientDiaries: React.FC<PatientDiariesProps> = ({
  patientId,
  diaryEntries,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const sortedDiaries = [...diaryEntries].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );

  return (
    <div className={styles.anamnesesSection}>
      <div className={styles.anamnesesHeader}>
        <Heading
          level={3}
          variant="subsection"
          className={styles.anamnesesTitle}
        >
          Дневники
        </Heading>

        <Button
          variant="secondary"
          onClick={(event) => {
            event.stopPropagation();

            navigate(`/patient/${patientId}/plans`);
          }}
        >
          Планы
        </Button>

        <Button
          variant="primary"
          onClick={(event) => {
            event.stopPropagation();

            onAdd(patientId);
          }}
        >
          + Добавить дневник
        </Button>
      </div>

      {sortedDiaries.length === 0 ? (
        <p className={styles.noAnamnesis}>Дневников пока нет</p>
      ) : (
        <div className={styles.anamnesisList}>
          {sortedDiaries.map((diary) => (
            <div key={diary.id} className={styles.anamnesisItem}>
              <div className={styles.anamnesisInfo}>
                <strong>{formatDiaryTitle(diary.date)}</strong>

                <span>
                  Последнее изменение:{" "}
                  {new Date(diary.updatedAt).toLocaleString("ru-RU")}
                </span>
              </div>

              <div className={styles.anamnesisActions}>
                <Button
                  variant="secondary"
                  onClick={(event) => {
                    event.stopPropagation();

                    onEdit(patientId, diary.id);
                  }}
                >
                  Редактировать
                </Button>

                <Button
                  variant="danger"
                  onClick={(event) => {
                    event.stopPropagation();

                    onDelete(patientId, diary.id);
                  }}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
