import React from "react";

import { Controller, useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { ToggleSwitch } from "@/shared/ui/ToggleSwitch";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const Type2AdherenceSection: React.FC = () => {
  const { register, watch, control } = useFormContext<AnamnesisFormData>();

  const insulinTherapy = boolFromString(watch("type2Diabetes.insulinTherapy"));

  const therapyRegularity = boolFromString(
    watch("type2Diabetes.therapyRegularity"),
  );

  const missedSideEffects =
    watch("type2Diabetes.missedReasons.sideEffects") === true;

  const missedOther = watch("type2Diabetes.missedReasons.other") === true;

  const therapySideEffects = boolFromString(
    watch("type2Diabetes.therapySideEffects"),
  );

  return (
    <>
      {/* Инсулинотерапия — переключатель Да / Нет */}

      <Controller
        name="type2Diabetes.insulinTherapy"
        control={control}
        render={({ field }) => (
          <ToggleSwitch
            ref={field.ref}
            name={field.name}
            label="Инсулинотерапия"
            checked={boolFromString(field.value) === true}
            onChange={(checked) => field.onChange(checked)}
            onBlur={field.onBlur}
            onLabel="Да"
            offLabel="Нет"
          />
        )}
      />

      {insulinTherapy === true && (
        <Textarea
          label="Подробнее"
          {...register("type2Diabetes.insulinTherapyDetails")}
          rows={2}
        />
      )}

      {/* Приверженность — прежний выбор Да / Нет */}

      <YesNo
        label="Пропуски приёма назначенной терапии?"
        name="type2Diabetes.therapyRegularity"
        register={register}
        yesNoLabels={["Нет", "Да"]}
      />

      {therapyRegularity === false && (
        <>
          <Input
            label="Сколько раз в неделю можете пропустить приём таблеток?"
            type="number"
            {...register("type2Diabetes.missedDosesPerWeek")}
          />

          <fieldset className={styles.fieldset}>
            <legend>Что мешает принимать регулярно?</legend>

            <label>
              <input
                type="checkbox"
                {...register("type2Diabetes.missedReasons.sideEffects")}
              />{" "}
              Побочные эффекты
            </label>

            {missedSideEffects && (
              <Input
                label="Какие побочные эффекты?"
                {...register("type2Diabetes.missedReasons.sideEffectsDetails")}
              />
            )}

            <label>
              <input
                type="checkbox"
                {...register("type2Diabetes.missedReasons.cost")}
              />{" "}
              Стоимость
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type2Diabetes.missedReasons.complexity")}
              />{" "}
              Сложность схемы
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type2Diabetes.missedReasons.forgetfulness")}
              />{" "}
              Забывчивость
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type2Diabetes.missedReasons.other")}
              />{" "}
              Другое
            </label>

            {missedOther && (
              <Input
                label="Уточните"
                {...register("type2Diabetes.missedReasons.otherDetails")}
              />
            )}
          </fieldset>
        </>
      )}

      <YesNo
        label="Побочные эффекты"
        name="type2Diabetes.therapySideEffects"
        register={register}
      />

      {therapySideEffects === true && (
        <Textarea
          label="Подробнее"
          {...register("type2Diabetes.therapySideEffectsDetails")}
          rows={2}
        />
      )}
    </>
  );
};
