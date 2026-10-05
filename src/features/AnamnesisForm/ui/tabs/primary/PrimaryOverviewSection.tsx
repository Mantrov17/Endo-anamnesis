import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../../Field";

import styles from "../../styles.module.scss";

export const PrimaryOverviewSection: React.FC = () => {
  const {
    register,

    formState: { errors },
  } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <Field
        hint="Что вас к нам привело? С какими жалобами поступили?"
        noteKey="primaryExam.reason"
      >
        <Textarea
          label="Причина обращения"
          {...register("primaryExam.reason")}
          error={errors.primaryExam?.reason?.message}
          rows={3}
        />
      </Field>

      <div className={styles.radioGroup}>
        <label>Подозрение / утверждение диагноза</label>

        <label>
          <input
            type="radio"
            value="type1"
            {...register("primaryExam.suspectedDiagnosis")}
          />{" "}
          СД 1 типа
        </label>

        <label>
          <input
            type="radio"
            value="type2"
            {...register("primaryExam.suspectedDiagnosis")}
          />{" "}
          СД 2 типа
        </label>

        {errors.primaryExam?.suspectedDiagnosis && (
          <span className={styles.error}>
            {errors.primaryExam.suspectedDiagnosis.message}
          </span>
        )}
      </div>
    </>
  );
};
