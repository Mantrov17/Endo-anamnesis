import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const Type2AdherenceSection: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const missedSideEffects =
    watch("type2Diabetes.missedReasons.sideEffects") === true;

  const missedOther = watch("type2Diabetes.missedReasons.other") === true;

  return (
    <>
      <YesNo
        label="Приверженность приёма терапии?"
        name="type2Diabetes.therapyRegularity"
        register={register}
      />

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
  );
};
