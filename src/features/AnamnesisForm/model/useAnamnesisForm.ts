import { useEffect, useState } from "react";

import { type SubmitHandler, useForm } from "react-hook-form";

import { type AnamnesisFormData, getPatientById } from "@/shared";

import { addAnamnesis, updateAnamnesis } from "@/shared/api/localStorageApi";

import {
  calculateAbi,
  calculateAge,
  calculateAgeAtDiagnosis,
  calculateBmi,
  calculateDailyInsulinDose,
  calculateDiagnosisYearFromAge,
  calculateDiseaseDuration,
  calculateH2FPEFScore,
  calculateInsulinDoseCoefficient,
  calculatePulsePressure,
  calculateTargetHba1c,
  parseDiagnosisYear,
} from "../lib/calculations";

import { mergeAnamnesisWithDefaults } from "../lib/normalizeAnamnesis";

interface UseAnamnesisFormProps {
  patientId: string;
  initialData?: AnamnesisFormData;
  anamnesisId?: string;
  onSuccess?: (anamnesisId: string) => void;
}

export const useAnamnesisForm = ({
  patientId,
  initialData,
  anamnesisId,
  onSuccess,
}: UseAnamnesisFormProps) => {
  const [currentAnamnesisId, setCurrentAnamnesisId] = useState<
    string | undefined
  >(anamnesisId);

  const formMethods = useForm<AnamnesisFormData>({
    defaultValues: mergeAnamnesisWithDefaults(initialData ?? {}),
  });

  const { handleSubmit, watch, setValue } = formMethods;

  // ==================== Данные пациента ====================

  useEffect(() => {
    const patient = getPatientById(patientId);

    if (!patient) {
      return;
    }

    setValue("birthDate", patient.birthDate);

    setValue("fullName", patient.fullName);

    setValue("gender", patient.gender);
  }, [patientId, setValue]);

  // ==================== ИМТ ====================

  // eslint-disable-next-line react-hooks/incompatible-library
  const pHeight = watch("primaryExam.height");

  const pWeight = watch("primaryExam.weight");

  useEffect(() => {
    const bmi = calculateBmi(pHeight, pWeight);

    setValue("primaryExam.bmi", bmi);
  }, [pHeight, pWeight, setValue]);

  // ==================== Целевой HbA1c ====================

  const birthDateForTarget = watch("birthDate");

  useEffect(() => {
    const age = calculateAge(birthDateForTarget);

    if (age === null) {
      setValue("therapy.targetHba1c", "", {
        shouldDirty: false,
      });

      return;
    }

    const target = calculateTargetHba1c(age);

    setValue("therapy.targetHba1c", target, {
      shouldDirty: false,
    });
  }, [birthDateForTarget, setValue]);

  // ==================== СД 1 ====================

  const t1Year = watch("type1Diabetes.yearOfDiagnosis");

  const t1Age = watch("type1Diabetes.ageAtDiagnosis");

  const birthDate = watch("birthDate");

  useEffect(() => {
    const diagnosisYear = parseDiagnosisYear(t1Year);

    if (diagnosisYear === null) {
      setValue("type1Diabetes.diseaseDuration", null);

      return;
    }

    const ageAtDiagnosis = calculateAgeAtDiagnosis(diagnosisYear, birthDate);

    if (ageAtDiagnosis !== null) {
      setValue("type1Diabetes.ageAtDiagnosis", ageAtDiagnosis);
    }

    setValue(
      "type1Diabetes.diseaseDuration",
      calculateDiseaseDuration(diagnosisYear),
    );
  }, [t1Year, birthDate, setValue]);

  useEffect(() => {
    if (!birthDate) {
      return;
    }

    const currentYear = String(t1Year ?? "").trim();

    if (currentYear) {
      return;
    }

    const diagnosisYear = calculateDiagnosisYearFromAge(birthDate, t1Age);

    if (diagnosisYear === null) {
      return;
    }

    setValue("type1Diabetes.yearOfDiagnosis", diagnosisYear);
  }, [t1Age, birthDate, t1Year, setValue]);

  // ==================== СД 2 ====================

  const t2Year = watch("type2Diabetes.yearOfDiagnosis");

  const t2Age = watch("type2Diabetes.ageAtDiagnosis");

  useEffect(() => {
    const diagnosisYear = parseDiagnosisYear(t2Year);

    if (diagnosisYear === null) {
      setValue("type2Diabetes.diseaseDuration", null);

      return;
    }

    const ageAtDiagnosis = calculateAgeAtDiagnosis(diagnosisYear, birthDate);

    if (ageAtDiagnosis !== null) {
      setValue("type2Diabetes.ageAtDiagnosis", ageAtDiagnosis);
    }

    setValue(
      "type2Diabetes.diseaseDuration",
      calculateDiseaseDuration(diagnosisYear),
    );
  }, [t2Year, birthDate, setValue]);

  useEffect(() => {
    if (!birthDate) {
      return;
    }

    const currentYear = String(t2Year ?? "").trim();

    if (currentYear) {
      return;
    }

    const diagnosisYear = calculateDiagnosisYearFromAge(birthDate, t2Age);

    if (diagnosisYear === null) {
      return;
    }

    setValue("type2Diabetes.yearOfDiagnosis", diagnosisYear);
  }, [t2Age, birthDate, t2Year, setValue]);

  // ==================== Суточная доза инсулина ====================

  const actualBase = watch("actualTherapy.basalInsulin");

  const actualBolus = watch("actualTherapy.bolusInsulin");

  const actualCoefficient = watch("actualTherapy.insulinDoseCoefficient");

  useEffect(() => {
    const dailyDose = calculateDailyInsulinDose(
      actualBase,
      actualBolus,
      pHeight,
      actualCoefficient,
    );

    setValue("actualTherapy.calculatedDailyInsulinDose", dailyDose);
  }, [actualBase, actualBolus, actualCoefficient, pHeight, setValue]);

  // ==================== Коэффициент СДИ ====================

  const diseaseDurationForCoefficient = watch("type1Diabetes.diseaseDuration");

  useEffect(() => {
    const coefficient = calculateInsulinDoseCoefficient(
      diseaseDurationForCoefficient,
    );

    setValue("actualTherapy.insulinDoseCoefficient", coefficient);
  }, [diseaseDurationForCoefficient, setValue]);

  // ==================== Пульсовое давление ====================

  const leftSystolic = watch("measurements.bpArms.leftSystolic");

  const leftDiastolic = watch("measurements.bpArms.leftDiastolic");

  useEffect(() => {
    const pulsePressure = calculatePulsePressure(leftSystolic, leftDiastolic);

    setValue("measurements.pulsePressure", pulsePressure);
  }, [leftSystolic, leftDiastolic, setValue]);

  // ==================== ЛПИ ====================

  const legLeft = watch("measurements.bpLegs.leftSystolic");

  const legRight = watch("measurements.bpLegs.rightSystolic");

  const armLeft = watch("measurements.bpArms.leftSystolic");

  const armRight = watch("measurements.bpArms.rightSystolic");

  useEffect(() => {
    const leftAbi = calculateAbi(legLeft, armLeft);

    const rightAbi = calculateAbi(legRight, armRight);

    setValue("measurements.abiIndex.left", leftAbi);

    setValue("measurements.abiIndex.right", rightAbi);
  }, [legLeft, legRight, armLeft, armRight, setValue]);

  // ==================== H2FPEF ====================

  const h2fpef = watch("h2fpef");

  useEffect(() => {
    if (!h2fpef) {
      return;
    }

    const score = calculateH2FPEFScore(h2fpef);

    setValue("h2fpef.totalScore", score);
  }, [h2fpef, setValue]);

  // ==================== Сохранение ====================

  const onSubmit: SubmitHandler<AnamnesisFormData> = (data) => {
    const patient = getPatientById(patientId);

    if (!patient) {
      alert("Пациент не найден");

      return;
    }

    const payload = mergeAnamnesisWithDefaults({
      ...data,

      fullName: patient.fullName,

      birthDate: patient.birthDate,

      gender: patient.gender,
    });

    if (currentAnamnesisId) {
      const success = updateAnamnesis(patientId, currentAnamnesisId, payload);

      if (success) {
        onSuccess?.(currentAnamnesisId);
      } else {
        alert("Не удалось обновить анамнез");
      }

      return;
    }

    const newRecord = addAnamnesis(patientId, payload);

    if (!newRecord) {
      alert("Пациент не найден");

      return;
    }

    setCurrentAnamnesisId(newRecord.id);

    onSuccess?.(newRecord.id);
  };

  return {
    formMethods,

    submitForm: handleSubmit(onSubmit),

    currentAnamnesisId,
  };
};
