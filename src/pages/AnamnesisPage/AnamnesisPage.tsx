import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getAnamnesisById, type AnamnesisFormData } from "@/entities/anamnesis";

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

  const { patientId, anamnesisId } = useParams<{
    patientId: string;
    anamnesisId?: string;
  }>();

  const [isSaved, setIsSaved] = useState(false);

  const [initialData, setInitialData] = useState<AnamnesisFormData | undefined>(
    undefined,
  );

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

    if (anamnesisId) {
      const anamnesis = getAnamnesisById(patientId, anamnesisId);

      if (anamnesis) {
        const formData = normalizeAnamnesisFormData(anamnesis);

        setInitialData(formData);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError("Анамнез не найден");
      }
    }

    setLoading(false);
  }, [patientId, anamnesisId, navigate]);

  const handleFormSuccess = (savedAnamnesisId: string) => {
    setIsSaved(true);

    window.setTimeout(() => {
      setIsSaved(false);
    }, 3000);

    /*
     * После первого сохранения
     * переводим страницу с route
     * "новый анамнез" на route
     * созданной записи.
     *
     * replace нужен, чтобы кнопка
     * "Назад" не возвращала нас
     * на уже неактуальную форму
     * создания.
     */
    if (!anamnesisId && patientId) {
      navigate(`/patient/${patientId}/anamnesis/${savedAnamnesisId}`, {
        replace: true,
      });
    }
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
          {anamnesisId ? "Редактирование анамнеза" : "Новый анамнез пациента"}
        </Heading>
      </div>

      <AnamnesisForm
        patientId={patientId}
        initialData={initialData}
        anamnesisId={anamnesisId}
        onSuccess={handleFormSuccess}
      />

      {isSaved && <SuccessMessage>✅ Анамнез успешно сохранён.</SuccessMessage>}
    </main>
  );
};
