import React, { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

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

  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * localStorage — синхронное хранилище.
   *
   * Поэтому читаем данные пациента сразу,
   * а не ждём useEffect с loading=true.
   */
  const patient = useMemo(
    () => (patientId ? getPatientById(patientId) : undefined),
    [patientId],
  );

  /*
   * Нормализуем официально сохранённый анамнез.
   *
   * Более свежий черновик при необходимости
   * восстановит useAnamnesisForm.
   */
  const initialData = useMemo(
    () =>
      patient?.primaryAnamnesis
        ? normalizeAnamnesisFormData(patient.primaryAnamnesis)
        : undefined,
    [patient],
  );

  useEffect(() => {
    if (!patientId) {
      navigate("/", {
        replace: true,
      });
    }
  }, [patientId, navigate]);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current !== null) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handleFormSuccess = () => {
    setIsSaved(true);

    if (successTimeoutRef.current !== null) {
      clearTimeout(successTimeoutRef.current);
    }

    successTimeoutRef.current = setTimeout(() => {
      setIsSaved(false);
      successTimeoutRef.current = null;
    }, 3000);
  };

  if (!patientId) {
    return null;
  }

  if (!patient) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Пациент не найден</div>

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
        key={patientId}
        patientId={patientId}
        initialData={initialData}
        anamnesisId={patient.primaryAnamnesis?.id}
        onSuccess={handleFormSuccess}
      />

      {isSaved && (
        <SuccessMessage>✅ Первичный анамнез успешно сохранён.</SuccessMessage>
      )}
    </main>
  );
};
