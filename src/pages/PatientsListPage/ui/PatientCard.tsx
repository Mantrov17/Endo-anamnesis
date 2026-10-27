import React from "react";

import type { Patient, PatientDepartureProcedureKey } from "@/entities/patient";

import { Button } from "@/shared/ui/Button";

import { Heading } from "@/shared/ui/Heading";

import boxIcon from "@/shared/assets/patientProcedures/box.png";
import boxIconActive from "@/shared/assets/patientProcedures/box-active.png";
import syringeIcon from "@/shared/assets/patientProcedures/syringe.png";
import syringeIconActive from "@/shared/assets/patientProcedures/syringe-active.png";
import memoIcon from "@/shared/assets/patientProcedures/memo.png";
import memoIconActive from "@/shared/assets/patientProcedures/memo-active.png";

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

  onOpenDailyProfile: (patientId: string) => void;

  onAddDiary: (patientId: string) => void;

  onEditDiary: (patientId: string, diaryId: string) => void;

  onDeleteDiary: (patientId: string, diaryId: string) => void;

  onToggleDepartureProcedure: (
    patientId: string,
    procedureKey: PatientDepartureProcedureKey,
  ) => void;
}

const procedureIcons: {
  key: PatientDepartureProcedureKey;
  label: string;
  inactiveIcon: string;
  activeIcon: string;
}[] = [
  {
    key: "suppliesPrepared",
    label: "Расходные материалы / набор подготовлены",
    inactiveIcon: boxIcon,
    activeIcon: boxIconActive,
  },
  {
    key: "injectionCompleted",
    label: "Инъекция выполнена",
    inactiveIcon: syringeIcon,
    activeIcon: syringeIconActive,
  },
  {
    key: "recommendationsGiven",
    label: "Рекомендации / памятка выданы",
    inactiveIcon: memoIcon,
    activeIcon: memoIconActive,
  },
];

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  isExpanded,
  onToggle,
  onEditPatient,
  onDeletePatient,
  onOpenPrimaryAnamnesis,
  onOpenGlycemicProfile,
  onOpenDailyProfile,
  onAddDiary,
  onEditDiary,
  onDeleteDiary,
  onToggleDepartureProcedure,
}) => {
  const age = getPatientAgeLabel(patient.birthDate);

  const birthInfo = patient.birthDate
    ? `${patient.birthDate} (${age})`
    : "Дата рождения не указана";

  const genderLabel = patient.gender === "male" ? "М" : "Ж";

  const createdDateTime = new Date(patient.createdAt).toLocaleString("ru-RU");

  const departureChecklist = patient.departureChecklist;

  const isDepartureChecklistCompleted =
    Object.values(departureChecklist).every(Boolean);

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader} onClick={() => onToggle(patient.id)}>
        <div className={styles.patientSummary}>
          <span className={styles.expandIcon} aria-hidden="true">
            {isExpanded ? "▼" : "▶"}
          </span>

          <div className={styles.patientMain}>
            <Heading level={2} variant="card" className={styles.patientName}>
              {patient.fullName}
            </Heading>

            <div className={styles.patientInfoStack}>
              <div className={styles.birthRow}>
                <span className={styles.patientMeta}>
                  {birthInfo} • {genderLabel}
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
              </div>

              <div className={styles.badgesRow}>
                <span className={styles.anamnesisCount}>
                  {patient.primaryAnamnesis
                    ? "Первичный анамнез заполнен"
                    : "Первичный анамнез не заполнен"}
                </span>

                <span className={styles.anamnesisCount}>
                  Дневников: {patient.diaryEntries.length}
                </span>
              </div>

              <div
                className={styles.departureChecklistRow}
                onClick={(event) => event.stopPropagation()}
              >
                <span
                  className={[
                    styles.departureStatusDot,
                    isDepartureChecklistCompleted
                      ? styles.departureStatusDone
                      : styles.departureStatusPending,
                  ].join(" ")}
                  title={
                    isDepartureChecklistCompleted
                      ? "Все процедуры выполнены"
                      : "Не все процедуры выполнены"
                  }
                  aria-label={
                    isDepartureChecklistCompleted
                      ? "Все процедуры выполнены"
                      : "Не все процедуры выполнены"
                  }
                />

                <div className={styles.departureChecklistButtons}>
                  {procedureIcons.map((item) => {
                    const isActive = departureChecklist[item.key];

                    return (
                      <button
                        key={item.key}
                        type="button"
                        className={[
                          styles.departureChecklistButton,
                          isActive ? styles.departureChecklistButtonActive : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() =>
                          onToggleDepartureProcedure(patient.id, item.key)
                        }
                        title={item.label}
                        aria-label={item.label}
                        aria-pressed={isActive}
                      >
                        <img
                          src={isActive ? item.activeIcon : item.inactiveIcon}
                          alt=""
                          className={styles.departureChecklistIcon}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <span className={styles.createdAtMeta}>
                Добавлен: {createdDateTime}
              </span>
            </div>
          </div>
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
            onOpenDailyProfile={onOpenDailyProfile}
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
