import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../../Field";

import styles from "../../styles.module.scss";
import localStyles from "./PrimaryOverviewSection.module.scss";

export const PrimaryOverviewSection: React.FC = () => {
  const {
    register,

    formState: { errors },
  } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <Field
        hint="С какой целью пациент обратился за медицинской помощью?"
        noteKey="primaryExam.reason"
      >
        <Textarea
          label="Причина обращения"
          {...register("primaryExam.reason")}
          error={errors.primaryExam?.reason?.message}
          rows={2}
          className={localStyles.reasonTextarea}
        />
      </Field>

      <Field noteKey="primaryExam.complaints">
        <Textarea
          label="Жалобы при поступлении"
          placeholder="Укажите жалобы пациента"
          {...register("primaryExam.complaints")}
          error={errors.primaryExam?.complaints?.message}
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

        <label className={styles.gravesDiagnosisOption}>
          <input
            type="radio"
            value="graves"
            {...register("primaryExam.suspectedDiagnosis")}
          />{" "}
          Болезнь Грейвса
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
