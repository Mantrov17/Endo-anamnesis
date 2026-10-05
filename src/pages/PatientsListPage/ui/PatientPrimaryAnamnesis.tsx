import React from "react";

import type { AnamnesisRecord } from "@/entities/anamnesis";

import { Button } from "@/shared/ui/Button";

import { Heading } from "@/shared/ui/Heading";

import styles from "../styles.module.scss";

interface PatientPrimaryAnamnesisProps {
  patientId: string;

  primaryAnamnesis: AnamnesisRecord | null;

  onOpen: (patientId: string) => void;

  onOpenGlycemicProfile: (patientId: string) => void;
}

export const PatientPrimaryAnamnesis: React.FC<
  PatientPrimaryAnamnesisProps
> = ({ patientId, primaryAnamnesis, onOpen, onOpenGlycemicProfile }) => {
  return (
    <div className={`${styles.anamnesesSection} ${styles.primarySection}`}>
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

        <div className={styles.primaryFormsActions}>
          <Button
            variant={primaryAnamnesis ? "secondary" : "primary"}
            onClick={(event) => {
              event.stopPropagation();

              onOpen(patientId);
            }}
          >
            {primaryAnamnesis
              ? "Открыть первичный анамнез"
              : "Заполнить первичный анамнез"}
          </Button>

          <Button
            variant="secondary"
            onClick={(event) => {
              event.stopPropagation();

              onOpenGlycemicProfile(patientId);
            }}
          >
            Гликемический профиль
          </Button>
        </div>
      </div>
    </div>
  );
};
