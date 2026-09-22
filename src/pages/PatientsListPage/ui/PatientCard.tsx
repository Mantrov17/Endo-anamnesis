import React from "react";

import type { Patient } from "@/shared";

import { Button } from "@/shared/ui/Button";
import { Heading } from "@/shared/ui/Heading";

import { getPatientAgeLabel } from "../lib/patientsList";
import { PatientAnamneses } from "./PatientAnamneses";

import styles from "../styles.module.scss";

interface PatientCardProps {
  patient: Patient;
  isExpanded: boolean;

  onToggle: (patientId: string) => void;

  onDeletePatient: (patientId: string) => void;

  onAddAnamnesis: (patientId: string) => void;

  onEditAnamnesis: (patientId: string, anamnesisId: string) => void;

  onDeleteAnamnesis: (patientId: string, anamnesisId: string) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  isExpanded,
  onToggle,
  onDeletePatient,
  onAddAnamnesis,
  onEditAnamnesis,
  onDeleteAnamnesis,
}) => {
  const age = getPatientAgeLabel(patient.birthDate);

  const createdDateTime = new Date(patient.createdAt).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
            {patient.birthDate} ({age}) •{" "}
            {patient.gender === "male" ? "М" : "Ж"}
          </span>

          <span className={styles.anamnesisCount}>
            Записей: {patient.anamneses.length}
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
        <PatientAnamneses
          patientId={patient.id}
          anamneses={patient.anamneses}
          onAdd={onAddAnamnesis}
          onEdit={onEditAnamnesis}
          onDelete={onDeleteAnamnesis}
        />
      )}
    </article>
  );
};
