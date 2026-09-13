import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPatientById,
  getAnamnesisById,
  type AnamnesisFormData,
} from "@/shared";
import { AnamnesisForm } from "@/features/AnamnesisForm";
import { SuccessMessage } from "@/shared/ui/SuccessMessage";
import { Button } from "@/shared/ui/Button";
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
      navigate("/");
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
        const formData: AnamnesisFormData = {
          primaryExam: anamnesis.primaryExam,
          type1Diabetes: anamnesis.type1Diabetes,
          therapy: anamnesis.therapy,
          hypoglycemia: anamnesis.hypoglycemia,
          lifestyle: anamnesis.lifestyle,
          notes: anamnesis.notes,
        };
        setInitialData(formData);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError("Анамнез не найден");
      }
    }
    setLoading(false);
  }, [patientId, anamnesisId, navigate]);

  const handleFormSuccess = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    setTimeout(() => navigate("/"), 1500);
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

  // Защита от отсутствия patientId (хотя useEffect уже должен был сделать редирект)
  if (!patientId) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>ID пациента не указан</div>
        <Button onClick={() => navigate("/")}>Вернуться к списку</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate("/")} className={styles.backButton}>
        ← Назад к списку пациентов
      </button>
      <h1 className={styles.title}>
        {anamnesisId ? "Редактирование анамнеза" : "Новый анамнез пациента"}
      </h1>
      <AnamnesisForm
        patientId={patientId}
        initialData={initialData}
        anamnesisId={anamnesisId}
        onSuccess={handleFormSuccess}
      />
      {isSaved && <SuccessMessage>✅ Анамнез успешно сохранён.</SuccessMessage>}
    </div>
  );
};
