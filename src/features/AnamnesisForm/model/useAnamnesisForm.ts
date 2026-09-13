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

  // ИМТ (СД 2)
  const height = watch("type2Diabetes.height");
  const weight = watch("type2Diabetes.weight");
  useEffect(() => {
    if (height && weight && height > 0) {
      const bmi = +(weight / Math.pow(height / 100, 2)).toFixed(1);
      setValue("type2Diabetes.bmi", bmi);
    }
  }, [height, weight, setValue]);

  // Пульсовое давление
  const leftSys = watch("measurements.bpArms.leftSystolic");
  const leftDia = watch("measurements.bpArms.leftDiastolic");
  useEffect(() => {
    if (leftSys && leftDia) {
      setValue("measurements.pulsePressure", leftSys - leftDia);
    }
  }, [leftSys, leftDia, setValue]);

  // ЛПИ
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

  // H2FPEF
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
