import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { getPatientById } from "@/entities/patient";

import {
  AnamnesisForm,
  normalizeAnamnesisFormData,
} from "@/features/AnamnesisForm";

import { Button } from "@/shared/ui/Button";

import { Heading } from "@/shared/ui/Heading";

import { SuccessMessage } from "@/shared/ui/SuccessMessage";

import styles from "./styles.module.scss";

export const AnamnesisPage: React.FC = () => {
  const navigate = useNavigate();

  const { patientId } = useParams<{
    patientId: string;
  }>();

  const [isSaved, setIsSaved] = useState(false);

  const [initialData, setInitialData] = useState<AnamnesisFormData | undefined>(
    undefined,
  );

  const [primaryAnamnesisId, setPrimaryAnamnesisId] = useState<
    string | undefined
  >(undefined);

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      navigate("/", {
        replace: true,
      });

      return;
    }

    const patient = getPatientById(patientId);

    if (!patient) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Пациент не найден");

      setLoading(false);

      return;
    }

    if (patient.primaryAnamnesis) {
      const formData = normalizeAnamnesisFormData(patient.primaryAnamnesis);

      setInitialData(formData);

      setPrimaryAnamnesisId(patient.primaryAnamnesis.id);
    } else {
      setInitialData(undefined);

      setPrimaryAnamnesisId(undefined);
    }

    setLoading(false);
  }, [patientId, navigate]);

  const handleFormSuccess = () => {
    setIsSaved(true);

    window.setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  if (loading) {
    return <div className={styles.container}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>

        <Button onClick={() => navigate("/")}>Вернуться к списку</Button>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>ID пациента не указан</div>

        <Button onClick={() => navigate("/")}>Вернуться к списку</Button>
      </div>
    );
  }

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

        <Heading level={1} variant="page" className={styles.title}>
          Первичный анамнез
        </Heading>
      </div>

      <AnamnesisForm
        patientId={patientId}
        initialData={initialData}
        anamnesisId={primaryAnamnesisId}
        onSuccess={handleFormSuccess}
      />

      {isSaved && (
        <SuccessMessage>✅ Первичный анамнез успешно сохранён.</SuccessMessage>
      )}
    </main>
  );
};
