import React, { useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  type DiaryFormData,
  formatDiaryTitle,
  getDiaryById,
  getTodayLocalDate,
} from "@/entities/diary";

import { getPatientById } from "@/entities/patient";

import { DiaryForm } from "@/features/DiaryForm";

import { Button } from "@/shared/ui/Button";

import { Heading } from "@/shared/ui/Heading";

import { SuccessMessage } from "@/shared/ui/SuccessMessage";

import styles from "./styles.module.scss";

export const DiaryPage: React.FC = () => {
  const navigate = useNavigate();

  const { patientId, diaryId } = useParams<{
    patientId: string;
    diaryId?: string;
  }>();

  const [isSaved, setIsSaved] = useState(false);

  const patient = useMemo(() => {
    if (!patientId) {
      return undefined;
    }

    return getPatientById(patientId);
  }, [patientId]);

  const diary = useMemo(() => {
    if (!patientId || !diaryId) {
      return undefined;
    }

    return getDiaryById(patientId, diaryId);
  }, [patientId, diaryId]);

  const initialData = useMemo<DiaryFormData | undefined>(() => {
    if (!diary) {
      return undefined;
    }

    return {
      complaints: diary.complaints,

      bloodPressure: diary.bloodPressure,

      saturation: diary.saturation,

      edema: diary.edema,

      plannedActivities: diary.plannedActivities,

      otherData: diary.otherData,
    };
  }, [diary]);

  if (!patientId) {
    return (
      <main className={styles.container}>
        <p>ID пациента не указан</p>

        <Button onClick={() => navigate("/")}>К списку пациентов</Button>
      </main>
    );
  }

  if (!patient) {
    return (
      <main className={styles.container}>
        <p>Пациент не найден</p>

        <Button onClick={() => navigate("/")}>К списку пациентов</Button>
      </main>
    );
  }

  if (diaryId && !diary) {
    return (
      <main className={styles.container}>
        <p>Дневник не найден</p>

        <Button onClick={() => navigate("/")}>К списку пациентов</Button>
      </main>
    );
  }

  const diaryDate = diary?.date ?? getTodayLocalDate();

  const handleSuccess = (savedDiaryId: string) => {
    setIsSaved(true);

    window.setTimeout(() => {
      setIsSaved(false);
    }, 3000);

    if (!diaryId) {
      navigate(`/patient/${patientId}/diary/${savedDiaryId}`, {
        replace: true,
      });
    }
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
            {formatDiaryTitle(diaryDate)}
          </Heading>

          <div className={styles.patientName}>{patient.fullName}</div>
        </div>
      </div>

      <DiaryForm
        key={diaryId ?? "new-diary"}
        patientId={patientId}
        diaryId={diaryId}
        initialData={initialData}
        onSuccess={handleSuccess}
      />

      {isSaved && <SuccessMessage>✅ Дневник сохранён.</SuccessMessage>}
    </main>
  );
};
