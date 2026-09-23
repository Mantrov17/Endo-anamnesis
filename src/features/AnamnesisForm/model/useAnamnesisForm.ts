import { useEffect, useState } from "react";

import { type SubmitHandler, useForm } from "react-hook-form";

import {
  addAnamnesis,
  type AnamnesisFormData,
  updateAnamnesis,
} from "@/entities/anamnesis";

import { getPatientById } from "@/entities/patient";

import { getStorageWriteErrorMessage } from "@/shared/lib/storage/jsonStorage";

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

    shouldUnregister: false,
  });

  const { handleSubmit, watch, setValue } = formMethods;

  useEffect(() => {
    if (anamnesisId) {
      setCurrentAnamnesisId(anamnesisId);
    }
  }, [anamnesisId]);

  // ====================
  // Данные пациента
  // ====================

  useEffect(() => {
    const patient = getPatientById(patientId);

    if (!patient) {
      return;
    }

    /*
     * Пустая дата в карточке пациента
     * не должна очищать дату, которая
     * уже могла быть сохранена
     * непосредственно в анамнезе.
     */
    if (patient.birthDate) {
      setValue("birthDate", patient.birthDate, {
        shouldDirty: false,
      });
    }

    setValue("fullName", patient.fullName, {
      shouldDirty: false,
    });

    setValue("gender", patient.gender, {
      shouldDirty: false,
    });
  }, [patientId, setValue]);

  // ====================
  // Дата рождения / возраст
  // ====================

  const birthDate = watch("birthDate");

  const currentAge = calculateAge(birthDate);

  // ====================
  // ИМТ
  // ====================

  // eslint-disable-next-line react-hooks/incompatible-library
  const pHeight = watch("primaryExam.height");

  const pWeight = watch("primaryExam.weight");

  useEffect(() => {
    const bmi = calculateBmi(pHeight, pWeight);

    setValue("primaryExam.bmi", bmi);
  }, [pHeight, pWeight, setValue]);

  // ====================
  // Целевой HbA1c
  // ====================

  useEffect(() => {
    if (currentAge === null) {
      setValue("therapy.targetHba1c", "", {
        shouldDirty: false,
      });

      return;
    }

    setValue(
      "therapy.targetHba1c",

      calculateTargetHba1c(currentAge),

      {
        shouldDirty: false,
      },
    );
  }, [currentAge, setValue]);

  // ====================
  // СД 1
  // ====================

  const t1Year = watch("type1Diabetes.yearOfDiagnosis");

  const t1Age = watch("type1Diabetes.ageAtDiagnosis");

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

  // ====================
  // СД 2
  // ====================

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

  // ====================
  // Суточная доза инсулина
  // ====================

  const actualBase = watch("actualTherapy.basalInsulin");

  const actualBolus = watch("actualTherapy.bolusInsulin");

  const actualCoefficient = watch("actualTherapy.insulinDoseCoefficient");

  useEffect(() => {
    setValue(
      "actualTherapy.calculatedDailyInsulinDose",

      calculateDailyInsulinDose(
        actualBase,
        actualBolus,
        pHeight,
        actualCoefficient,
      ),
    );
  }, [actualBase, actualBolus, actualCoefficient, pHeight, setValue]);

  // ====================
  // Коэффициент СДИ
  // ====================

  const diseaseDurationForCoefficient = watch("type1Diabetes.diseaseDuration");

  useEffect(() => {
    setValue(
      "actualTherapy.insulinDoseCoefficient",

      calculateInsulinDoseCoefficient(diseaseDurationForCoefficient),
    );
  }, [diseaseDurationForCoefficient, setValue]);

  // ====================
  // Пульсовое давление
  // ====================

  const leftSystolic = watch("measurements.bpArms.leftSystolic");

  const leftDiastolic = watch("measurements.bpArms.leftDiastolic");

  useEffect(() => {
    setValue(
      "measurements.pulsePressure",

      calculatePulsePressure(leftSystolic, leftDiastolic),
    );
  }, [leftSystolic, leftDiastolic, setValue]);

  // ====================
  // ЛПИ
  // ====================

  const legLeft = watch("measurements.bpLegs.leftSystolic");

  const legRight = watch("measurements.bpLegs.rightSystolic");

  const armLeft = watch("measurements.bpArms.leftSystolic");

  const armRight = watch("measurements.bpArms.rightSystolic");

  useEffect(() => {
    setValue(
      "measurements.abiIndex.left",

      calculateAbi(legLeft, armLeft),
    );

    setValue(
      "measurements.abiIndex.right",

      calculateAbi(legRight, armRight),
    );
  }, [legLeft, legRight, armLeft, armRight, setValue]);

  // ====================
  // H2FPEF — возраст
  // ====================

  useEffect(() => {
    setValue(
      "h2fpef.elderly60",

      currentAge !== null ? currentAge > 60 : false,

      {
        shouldDirty: false,
      },
    );
  }, [currentAge, setValue]);

  // ====================
  // H2FPEF — сумма
  // ====================

  const h2fpef = watch("h2fpef");

  useEffect(() => {
    if (!h2fpef) {
      return;
    }

    setValue(
      "h2fpef.totalScore",

      calculateH2FPEFScore(h2fpef),
    );
  }, [h2fpef, setValue]);

  // ====================
  // Сохранение
  // ====================

  const onSubmit: SubmitHandler<AnamnesisFormData> = (data) => {
    try {
      const patient = getPatientById(patientId);

      if (!patient) {
        window.alert("Пациент не найден");

        return;
      }

      /*
       * Приоритет у даты,
       * введённой непосредственно
       * в анамнезе.
       *
       * Если её там нет,
       * используем дату из
       * карточки пациента.
       */
      const effectiveBirthDate = data.birthDate || patient.birthDate;

      const payload = mergeAnamnesisWithDefaults({
        ...data,

        fullName: patient.fullName,

        birthDate: effectiveBirthDate,

        gender: patient.gender,
      });

      if (currentAnamnesisId) {
        const success = updateAnamnesis(patientId, currentAnamnesisId, payload);

        if (!success) {
          window.alert("Анамнез не найден. Возможно, он был удалён.");

          return;
        }

        onSuccess?.(currentAnamnesisId);

        return;
      }

      const newRecord = addAnamnesis(patientId, payload);

      if (!newRecord) {
        window.alert("Пациент не найден");

        return;
      }

      setCurrentAnamnesisId(newRecord.id);

      onSuccess?.(newRecord.id);
    } catch (error) {
      console.error("Ошибка сохранения анамнеза:", error);

      window.alert(getStorageWriteErrorMessage(error));
    }
  };

  return {
    formMethods,

    submitForm: handleSubmit(onSubmit),

    currentAnamnesisId,
  };
};
