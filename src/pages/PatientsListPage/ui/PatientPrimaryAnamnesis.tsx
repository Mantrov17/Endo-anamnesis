import React from "react";

import type { AnamnesisRecord } from "@/entities/anamnesis";

import { Button } from "@/shared/ui/Button";

import { Heading } from "@/shared/ui/Heading";

import styles from "../styles.module.scss";

interface PatientPrimaryAnamnesisProps {
  patientId: string;

  primaryAnamnesis: AnamnesisRecord | null;

  onOpen: (patientId: string) => void;
}

export const PatientPrimaryAnamnesis: React.FC<
  PatientPrimaryAnamnesisProps
> = ({ patientId, primaryAnamnesis, onOpen }) => {
  return (
    <div className={styles.anamnesesSection}>
      <div className={styles.anamnesesHeader}>
        <Heading
          level={3}
          variant="subsection"
          className={styles.anamnesesTitle}
        >
          Первичный анамнез
        </Heading>
      </div>

      <div className={styles.anamnesisItem}>
        <div className={styles.anamnesisInfo}>
          {primaryAnamnesis ? (
            <>
              <strong>Первичный анамнез заполнен</strong>

              <span>
                Последнее сохранение:{" "}
                {new Date(primaryAnamnesis.savedAt).toLocaleString("ru-RU")}
              </span>
            </>
          ) : (
            <>
              <strong>Первичный анамнез ещё не заполнен</strong>

              <span>Заполните первичный анамнез пациента</span>
            </>
          )}
        </div>

        <div className={styles.anamnesisActions}>
          <Button
            variant={primaryAnamnesis ? "secondary" : "primary"}
            onClick={(event) => {
              event.stopPropagation();

              onOpen(patientId);
            }}
          >
            {primaryAnamnesis ? "Открыть" : "Заполнить"}
          </Button>
        </div>
      </div>
    </div>
  );
};
