import React from "react";

import type { Patient } from "@/entities/patient";

import { Button } from "@/shared/ui/Button";

import { Heading } from "@/shared/ui/Heading";

import { getPatientAgeLabel } from "../lib/patientsList";

import { PatientDiaries } from "./PatientDiaries";

import { PatientPrimaryAnamnesis } from "./PatientPrimaryAnamnesis";

import styles from "../styles.module.scss";

interface PatientCardProps {
  patient: Patient;

  isExpanded: boolean;

  onToggle: (patientId: string) => void;

  onEditPatient: (patientId: string) => void;

  onDeletePatient: (patientId: string) => void;

  onOpenPrimaryAnamnesis: (patientId: string) => void;

  onOpenGlycemicProfile: (patientId: string) => void;

  onAddDiary: (patientId: string) => void;

  onEditDiary: (patientId: string, diaryId: string) => void;

  onDeleteDiary: (patientId: string, diaryId: string) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  isExpanded,
  onToggle,
  onEditPatient,
  onDeletePatient,
  onOpenPrimaryAnamnesis,
  onOpenGlycemicProfile,
  onAddDiary,
  onEditDiary,
  onDeleteDiary,
}) => {
  const age = getPatientAgeLabel(patient.birthDate);

  const birthInfo = patient.birthDate
    ? `${patient.birthDate} (${age})`
    : "Дата рождения не указана";

  const createdDateTime = new Date(patient.createdAt).toLocaleString("ru-RU");

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader} onClick={() => onToggle(patient.id)}>
        <div className={styles.patientSummary}>
          <span className={styles.expandIcon} aria-hidden="true">
            {isExpanded ? "▼" : "▶"}
          </span>

          <Heading level={2} variant="card" className={styles.patientName}>
            {patient.fullName}
          </Heading>

          <span className={styles.patientMeta}>
            <span>
              {birthInfo} • {patient.gender === "male" ? "М" : "Ж"}
            </span>

            <button
              type="button"
              className={styles.patientMetaEditButton}
              onClick={(event) => {
                event.stopPropagation();

                onEditPatient(patient.id);
              }}
            >
              Редактировать
            </button>
          </span>

          <span className={styles.anamnesisCount}>
            {patient.primaryAnamnesis
              ? "Первичный анамнез заполнен"
              : "Первичный анамнез не заполнен"}
          </span>

          <span className={styles.anamnesisCount}>
            Дневников: {patient.diaryEntries.length}
          </span>

          <span className={styles.createdAtMeta}>
            Добавлен: {createdDateTime}
          </span>
        </div>

        <div
          className={styles.patientActions}
          onClick={(event) => event.stopPropagation()}
        >
          <Button variant="danger" onClick={() => onDeletePatient(patient.id)}>
            Удалить
          </Button>
        </div>
      </div>

      {isExpanded && (
        <>
          <PatientPrimaryAnamnesis
            patientId={patient.id}
            primaryAnamnesis={patient.primaryAnamnesis}
            onOpen={onOpenPrimaryAnamnesis}
            onOpenGlycemicProfile={onOpenGlycemicProfile}
          />

          <PatientDiaries
            patientId={patient.id}
            diaryEntries={patient.diaryEntries}
            onAdd={onAddDiary}
            onEdit={onEditDiary}
            onDelete={onDeleteDiary}
          />
        </>
      )}
    </article>
  );
};
