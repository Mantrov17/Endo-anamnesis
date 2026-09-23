import React from "react";

import { Button } from "@/shared/ui/Button";
import { Heading } from "@/shared/ui/Heading";

import styles from "../styles.module.scss";
import type { AnamnesisRecord } from "@/entities/anamnesis";

interface PatientAnamnesesProps {
  patientId: string;
  anamneses: AnamnesisRecord[];

  onAdd: (patientId: string) => void;

  onEdit: (patientId: string, anamnesisId: string) => void;

  onDelete: (patientId: string, anamnesisId: string) => void;
}

export const PatientAnamneses: React.FC<PatientAnamnesesProps> = ({
  patientId,
  anamneses,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.anamnesesSection}>
      <div className={styles.anamnesesHeader}>
        <Heading
          level={3}
          variant="subsection"
          className={styles.anamnesesTitle}
        >
          Анамнезы
        </Heading>

        <Button
          variant="primary"
          onClick={(event) => {
            event.stopPropagation();

            onAdd(patientId);
          }}
        >
          + Добавить анамнез
        </Button>
      </div>

      {anamneses.length === 0 ? (
        <p className={styles.noAnamnesis}>Нет анамнезов</p>
      ) : (
        <div className={styles.anamnesisList}>
          {anamneses.map((anam) => (
            <div key={anam.id} className={styles.anamnesisItem}>
              <div className={styles.anamnesisInfo}>
                <strong>
                  Анамнез от {new Date(anam.savedAt).toLocaleDateString()}
                </strong>

                <span>Создан: {new Date(anam.savedAt).toLocaleString()}</span>
              </div>

              <div className={styles.anamnesisActions}>
                <Button
                  variant="secondary"
                  onClick={(event) => {
                    event.stopPropagation();

                    onEdit(patientId, anam.id);
                  }}
                >
                  Редактировать
                </Button>

                <Button
                  variant="danger"
                  onClick={(event) => {
                    event.stopPropagation();

                    onDelete(patientId, anam.id);
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
