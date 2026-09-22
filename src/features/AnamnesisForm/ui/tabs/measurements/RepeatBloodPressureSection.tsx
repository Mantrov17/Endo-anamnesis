import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";

import styles from "../../styles.module.scss";

export const RepeatBloodPressureSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="measurements.bpRepeat">
      <fieldset className={styles.fieldset}>
        <legend>Повторное измерение АД</legend>

        <div className={styles.row}>
          <Input
            label="Левая — систолическое"
            type="number"
            suffix="мм рт. ст."
            {...register("measurements.bpRepeat.leftSystolic")}
          />

          <Input
            label="Левая — диастолическое"
            type="number"
            suffix="мм рт. ст."
            {...register("measurements.bpRepeat.leftDiastolic")}
          />
        </div>

        <div className={styles.row}>
          <Input
            label="Правая — систолическое"
            type="number"
            suffix="мм рт. ст."
            {...register("measurements.bpRepeat.rightSystolic")}
          />

          <Input
            label="Правая — диастолическое"
            type="number"
            suffix="мм рт. ст."
            {...register("measurements.bpRepeat.rightDiastolic")}
          />
        </div>
      </fieldset>
    </Field>
  );
};
