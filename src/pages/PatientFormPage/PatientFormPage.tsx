import React, { useEffect, useMemo } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { PatientForm } from "@/features/PatientForm";

import { getPatientById, type PatientFormData } from "@/entities/patient";

import { Heading } from "@/shared/ui/Heading";

import styles from "./styles.module.scss";

export const PatientFormPage: React.FC = () => {
  const navigate = useNavigate();

  const { patientId } = useParams<{
    patientId?: string;
  }>();

  const patient = useMemo(() => {
    if (!patientId) {
      return undefined;
    }

    return getPatientById(patientId);
  }, [patientId]);

  const initialData = useMemo<PatientFormData | undefined>(() => {
    if (!patient) {
      return undefined;
    }

    return {
      fullName: patient.fullName,

      birthDate: patient.birthDate,

      gender: patient.gender,
    };
  }, [patient]);

  useEffect(() => {
    if (!patientId || patient) {
      return;
    }

    window.alert("Пациент не найден");

    navigate("/", {
      replace: true,
    });
  }, [patientId, patient, navigate]);

  if (patientId && !patient) {
    return null;
  }

  return (
    <main className={styles.container}>
      <Heading level={1} variant="page" className={styles.title}>
        {patientId ? "Редактирование пациента" : "Новый пациент"}
      </Heading>

      <PatientForm
        key={patientId ?? "new-patient"}
        patientId={patientId}
        initialData={initialData}
        onSuccess={() => navigate("/")}
        onCancel={() => navigate("/")}
      />
    </main>
  );
};
