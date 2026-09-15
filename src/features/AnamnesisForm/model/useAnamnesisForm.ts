import { type SubmitHandler, useForm } from "react-hook-form";
import { type AnamnesisFormData, getPatientById } from "@/shared";
import { addAnamnesis, updateAnamnesis } from "@/shared/api/localStorageApi";
import { getDefaultValues } from "../lib/defaultValues";
import { useEffect } from "react";

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
    defaultValues: initialData ?? getDefaultValues(),
  });

  // Подгружаем данные пациента в скрытые поля формы,
  // чтобы можно было считать возраст по дате рождения
  useEffect(() => {
    const patient = getPatientById(patientId);
    if (!patient) return;
    setValue("birthDate", patient.birthDate);
    setValue("fullName", patient.fullName);
    setValue("gender", patient.gender);
  }, [patientId, setValue]);

  // NEW — ИМТ для блока антропометрии в начале формы
  const pHeight = watch("primaryExam.height");
  const pWeight = watch("primaryExam.weight");
  useEffect(() => {
    if (pHeight && pWeight && pHeight > 0) {
      const bmi = +(pWeight / Math.pow(pHeight / 100, 2)).toFixed(1);
      setValue("primaryExam.bmi", bmi);
    }
  }, [pHeight, pWeight, setValue]);

  // Целевой HbA1c в зависимости от возраста пациента
  const birthDateForTarget = watch("birthDate");
  useEffect(() => {
    if (!birthDateForTarget) {
      setValue("therapy.targetHba1c", "");
      return;
    }
    const birth = new Date(birthDateForTarget);
    if (isNaN(birth.getTime())) return;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    let value = "";
    if (age >= 18 && age <= 40) value = "<6,5% или <7%";
    else if (age >= 41 && age <= 59) value = "<7% или <7,5%";
    else if (age >= 60 && age <= 74) value = "<7,5% или <8%";

    setValue("therapy.targetHba1c", value, { shouldDirty: false });
  }, [birthDateForTarget, setValue]);

  // NEW — авторасчёт суточной дозы инсулина
  // Идеальная масса (кг) = (рост_см / 100)² × 19
  // Суточная доза = идеальная масса × коэффициент (0.5 / 0.7 / 0.9)
  const actualBase = watch("actualTherapy.basalInsulin");
  const actualBolus = watch("actualTherapy.bolusInsulin");
  const actualCoeff = watch("actualTherapy.insulinDoseCoefficient");
  useEffect(() => {
    const baseDose =
      actualBase?.reduce((sum, d) => {
        const n = parseFloat(String(d?.dose ?? "").replace(",", "."));
        return sum + (isNaN(n) ? 0 : n);
      }, 0) ?? 0;
    const bolusDose =
      actualBolus?.reduce((sum, d) => {
        const n = parseFloat(String(d?.dose ?? "").replace(",", "."));
        return sum + (isNaN(n) ? 0 : n);
      }, 0) ?? 0;
    const total = baseDose + bolusDose;
    if (total > 0) {
      setValue("actualTherapy.calculatedDailyInsulinDose", +total.toFixed(1));
    } else if (pHeight && actualCoeff) {
      const idealMass = Math.pow(pHeight / 100, 2) * 19;
      setValue(
        "actualTherapy.calculatedDailyInsulinDose",
        +(idealMass * actualCoeff).toFixed(1),
      );
    }
  }, [actualBase, actualBolus, actualCoeff, pHeight, setValue]);

  // Коэффициент СДИ по длительности СД
  const diseaseDurationForCoefficient = watch("type1Diabetes.diseaseDuration");
  useEffect(() => {
    if (
      diseaseDurationForCoefficient === null ||
      diseaseDurationForCoefficient === undefined
    )
      return;
    const d = Number(diseaseDurationForCoefficient);
    if (isNaN(d)) return;
    let coef: number;
    if (d < 5) coef = 0.5;
    else if (d <= 10) coef = 0.7;
    else coef = 0.9;
    setValue("actualTherapy.insulinDoseCoefficient", coef);
  }, [diseaseDurationForCoefficient, setValue]);

  // Пульсовое давление — старое
  const leftSys = watch("measurements.bpArms.leftSystolic");
  const leftDia = watch("measurements.bpArms.leftDiastolic");
  useEffect(() => {
    if (leftSys && leftDia) {
      setValue("measurements.pulsePressure", leftSys - leftDia);
    }
  }, [leftSys, leftDia, setValue]);

  // ЛПИ — старое
  const legLeft = watch("measurements.bpLegs.leftSystolic");
  const legRight = watch("measurements.bpLegs.rightSystolic");
  const armLeft = watch("measurements.bpArms.leftSystolic");
  const armRight = watch("measurements.bpArms.rightSystolic");
  useEffect(() => {
    if (legLeft && armLeft)
      setValue("measurements.abiIndex.left", +(legLeft / armLeft).toFixed(2));
    if (legRight && armRight)
      setValue(
        "measurements.abiIndex.right",
        +(legRight / armRight).toFixed(2),
      );
  }, [legLeft, legRight, armLeft, armRight, setValue]);

  // H2FPEF — старое
  const h2 = watch("h2fpef");
  useEffect(() => {
    if (!h2) return;
    const score =
      (h2.obesityBMI30 ? 2 : 0) +
      (h2.hypertension2Drugs ? 1 : 0) +
      (h2.atrialFibrillation ? 3 : 0) +
      (h2.pulmonaryHypertension ? 1 : 0) +
      (h2.elderly60 ? 1 : 0) +
      (h2.fillingPressure ? 1 : 0);
    setValue("h2fpef.totalScore", score);
  }, [h2, setValue]);

  const onSubmit: SubmitHandler<AnamnesisFormData> = (data) => {
    const patient = getPatientById(patientId);
    if (!patient) {
      alert("Пациент не найден");
      return;
    }

    const payload: AnamnesisFormData = {
      ...getDefaultValues(),
      ...data,
      fullName: patient.fullName,
      birthDate: patient.birthDate,
      gender: patient.gender,
    };

    if (anamnesisId) {
      const success = updateAnamnesis(patientId, anamnesisId, payload);
      if (success) {
        onSuccess?.();
        reset();
      } else {
        alert("Не удалось обновить анамнез");
      }
    } else {
      const newRecord = addAnamnesis(patientId, payload);
      if (newRecord) {
        onSuccess?.();
        reset();
      } else {
        alert("Пациент не найден");
      }
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
