import React, { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getPatientById } from "@/entities/patient";

import { GlycemicProfileForm } from "@/features/GlycemicProfileForm";

import { Button } from "@/shared/ui/Button";

import { Heading } from "@/shared/ui/Heading";

import { SuccessMessage } from "@/shared/ui/SuccessMessage";

import styles from "./styles.module.scss";

export const GlycemicProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const { patientId } = useParams<{
    patientId: string;
  }>();

  const [isSaved, setIsSaved] = useState(false);

  if (!patientId) {
    return (
      <main className={styles.container}>
        <p>ID пациента не указан</p>

        <Button onClick={() => navigate("/")}>К списку пациентов</Button>
      </main>
    );
  }

  const patient = getPatientById(patientId);

  if (!patient) {
    return (
      <main className={styles.container}>
        <p>Пациент не найден</p>

        <Button onClick={() => navigate("/")}>К списку пациентов</Button>
      </main>
    );
  }

  const handleSuccess = () => {
    setIsSaved(true);

    window.setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <main className={styles.container}>
      <div className={styles.pageHeader}>
        <button
          type="button"
          onClick={() => navigate("/")}
          className={styles.backButton}
        >
          <span className={styles.backIcon} aria-hidden="true">
            ←
          </span>

          <span className={styles.backText}>К списку пациентов</span>
        </button>

        <div className={styles.headerInfo}>
          <Heading level={1} variant="page" className={styles.title}>
            Гликемический профиль
          </Heading>

          <div className={styles.patientName}>{patient.fullName}</div>
        </div>
      </div>

      <GlycemicProfileForm
        patientId={patientId}
        initialDays={patient.glycemicProfile?.days}
        onSuccess={handleSuccess}
      />

      {isSaved && (
        <SuccessMessage>✅ Гликемический профиль сохранён.</SuccessMessage>
      )}
    </main>
  );
};
