import { useEffect } from "react";

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
  onSuccess?: () => void;
}

export const useAnamnesisForm = ({
  patientId,
  initialData,
  anamnesisId,
  onSuccess,
}: UseAnamnesisFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<AnamnesisFormData>({
    defaultValues: mergeAnamnesisWithDefaults(initialData ?? {}),
  });

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

    /*
     * Важно записывать и null.
     *
     * Если пользователь очистил рост или вес,
     * старое рассчитанное значение BMI должно исчезнуть.
     */
    setValue("primaryExam.bmi", bmi);
  }, [pHeight, pWeight, setValue]);

  // ==================== Целевой HbA1c ====================

  const birthDateForTarget = watch("birthDate");

  useEffect(() => {
    const age = calculateAge(birthDateForTarget);

    /*
     * Если дата рождения отсутствует или некорректна,
     * рассчитанное целевое значение очищаем.
     */
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

  /*
   * Год постановки диагноза
   * →
   * возраст на момент постановки
   * +
   * длительность заболевания
   */
  useEffect(() => {
    const diagnosisYear = parseDiagnosisYear(t1Year);

    /*
     * Если год удалили или он перестал быть корректным,
     * длительность заболевания больше нельзя считать.
     *
     * ageAtDiagnosis здесь специально не очищаем:
     * пользователь может вводить возраст вручную,
     * а из него ниже автоматически восстановится год.
     */
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

  /*
   * Возраст постановки диагноза
   * →
   * год постановки диагноза,
   * если год ещё не заполнен.
   */
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

  /*
   * Год постановки диагноза
   * →
   * возраст на момент постановки
   * +
   * длительность заболевания
   */
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

  /*
   * Возраст постановки диагноза
   * →
   * год постановки диагноза.
   */
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

    /*
     * Если пользователь удалил дозы,
     * рост или необходимые данные,
     * старую рассчитанную дозу также очищаем.
     */
    setValue("actualTherapy.calculatedDailyInsulinDose", dailyDose);
  }, [actualBase, actualBolus, actualCoefficient, pHeight, setValue]);

  // ==================== Коэффициент СДИ ====================

  const diseaseDurationForCoefficient = watch("type1Diabetes.diseaseDuration");

  useEffect(() => {
    const coefficient = calculateInsulinDoseCoefficient(
      diseaseDurationForCoefficient,
    );

    /*
     * Если длительность СД больше неизвестна,
     * старый коэффициент тоже не должен сохраняться.
     */
    setValue("actualTherapy.insulinDoseCoefficient", coefficient);
  }, [diseaseDurationForCoefficient, setValue]);

  // ==================== Пульсовое давление ====================

  const leftSystolic = watch("measurements.bpArms.leftSystolic");

  const leftDiastolic = watch("measurements.bpArms.leftDiastolic");

  useEffect(() => {
    const pulsePressure = calculatePulsePressure(leftSystolic, leftDiastolic);

    /*
     * Если одно из двух АД удалено,
     * пульсовое давление становится null.
     */
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

    /*
     * Левая и правая стороны независимы.
     *
     * Если данные удалили только справа,
     * правый ЛПИ очистится,
     * а левый останется рассчитанным.
     */
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

    if (anamnesisId) {
      const success = updateAnamnesis(patientId, anamnesisId, payload);

      if (success) {
        onSuccess?.();
        reset();
      } else {
        alert("Не удалось обновить анамнез");
      }

      return;
    }

    const newRecord = addAnamnesis(patientId, payload);

    if (newRecord) {
      onSuccess?.();
      reset();
    } else {
      alert("Пациент не найден");
    }
  };

  return {
    register,

    handleSubmit: handleSubmit(onSubmit),

    errors,
    watch,
    setValue,
    control,
    reset,
  };
};
