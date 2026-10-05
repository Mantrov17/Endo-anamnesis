import React, { useMemo } from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { BMI_REFERENCE } from "../../../lib/constants";

import { Field } from "../../Field";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const PrimaryOverviewSection: React.FC = () => {
  const {
    register,
    watch,

    formState: { errors },
  } = useFormContext<AnamnesisFormData>();

  const weightChange6Months = boolFromString(
    watch("primaryExam.weightChange6Months"),
  );

  const primaryBmi = watch("primaryExam.bmi");

  const bmiCategory = useMemo(() => {
    if (primaryBmi === null || primaryBmi === undefined || isNaN(primaryBmi)) {
      return null;
    }

    const value = Number(primaryBmi);

    if (value < 18) {
      return {
        label: "Дефицит массы тела",

        tone: "warn" as const,
      };
    }

    if (value < 25) {
      return {
        label: "Норма",

        tone: "ok" as const,
      };
    }

    if (value < 31) {
      return {
        label: "Избыточная масса тела",

        tone: "warn" as const,
      };
    }

    if (value < 36) {
      return {
        label: "Ожирение I степени",

        tone: "bad" as const,
      };
    }

    if (value < 41) {
      return {
        label: "Ожирение II степени",

        tone: "bad" as const,
      };
    }

    if (value < 46) {
      return {
        label: "Ожирение III степени",

        tone: "bad" as const,
      };
    }

    return {
      label: "Ожирение IV степени",

      tone: "bad" as const,
    };
  }, [primaryBmi]);

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

      <fieldset className={styles.fieldset}>
        <legend>Антропометрия</legend>

        <div className={styles.row}>
          <Input
            label="Рост"
            type="number"
            suffix="см"
            {...register("primaryExam.height")}
          />

          <Input
            label="Вес"
            type="number"
            step="0.1"
            suffix="кг"
            {...register("primaryExam.weight")}
          />

          <Field hint={BMI_REFERENCE}>
            <Input
              label="ИМТ (авторасчёт)"
              type="number"
              step="0.1"
              suffix="кг/см²"
              {...register("primaryExam.bmi")}
              readOnly
            />
          </Field>
        </div>

        {bmiCategory && (
          <div className={`${styles.bmiBadge} ${styles[bmiCategory.tone]}`}>
            {bmiCategory.label}
          </div>
        )}

        <Input
          label="Окружность талии"
          type="number"
          suffix="см"
          {...register("primaryExam.waistCircumference")}
        />

        <Field noteKey="primaryExam.weightChangeReason">
          <YesNo
            label="Изменился ли вес за последние 6 месяцев?"
            name="primaryExam.weightChange6Months"
            register={register}
          />
        </Field>

        {weightChange6Months === true && (
          <>
            <div className={styles.row}>
              <Input
                label="Увеличился на"
                type="number"
                suffix="кг"
                {...register("primaryExam.weightIncreasedBy")}
              />

              <Input
                label="Уменьшился на"
                type="number"
                suffix="кг"
                {...register("primaryExam.weightDecreasedBy")}
              />
            </div>

            <div className={styles.radioGroup}>
              <label>Причина изменения веса:</label>

              <label>
                <input
                  type="radio"
                  value="unmotivated"
                  {...register("primaryExam.weightChangeReason")}
                />{" "}
                Немотивируемое
              </label>

              <label>
                <input
                  type="radio"
                  value="stress"
                  {...register("primaryExam.weightChangeReason")}
                />{" "}
                Стресс
              </label>

              <label>
                <input
                  type="radio"
                  value="diet"
                  {...register("primaryExam.weightChangeReason")}
                />{" "}
                Диета
              </label>

              <label>
                <input
                  type="radio"
                  value="sport"
                  {...register("primaryExam.weightChangeReason")}
                />{" "}
                Спорт
              </label>
            </div>

            <Field noteKey="primaryExam.weightChangeReasonDetails">
              <Input
                label="Комментарий к причине (необязательно)"
                {...register("primaryExam.weightChangeReasonDetails" as never)}
              />
            </Field>
          </>
        )}
      </fieldset>

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
