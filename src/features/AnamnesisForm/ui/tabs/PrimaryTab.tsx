import React from "react";
import { Textarea } from "@/shared/ui/Textarea";
import { RadioGroup } from "@/shared/ui/RadioGroup";

interface PrimaryTabProps {
  register: any;
  errors: any;
}

export const PrimaryTab: React.FC<PrimaryTabProps> = ({ register, errors }) => {
  return (
    <>
      <Textarea
        label="Причина обращения"
        {...register("primaryExam.reason")}
        error={errors.primaryExam?.reason?.message}
        rows={3}
        placeholder="Что вас привело? С какими жалобами поступили?"
      />
      <RadioGroup
        name="primaryExam.suspectedDiagnosis"
        register={register}
        options={[
          { value: "type1", label: "СД 1 типа" },
          { value: "type2", label: "СД 2 типа" },
          { value: "unknown", label: "Неизвестно" },
        ]}
        error={errors.primaryExam?.suspectedDiagnosis?.message}
        label="Подозрение / утверждение диагноза"
      />
    </>
  );
};
