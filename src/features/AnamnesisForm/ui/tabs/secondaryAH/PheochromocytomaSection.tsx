import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const PheochromocytomaSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="secondaryHypertension.pheochromocytoma">
      <fieldset className={styles.fieldset}>
        <legend>🚩 Феохромоцитома</legend>

        <div className={styles.radioGroup}>
          <label>Динамика:</label>

          <label>
            <input
              type="radio"
              value="stable"
              {...register(
                "secondaryHypertension.pheochromocytoma.stableOrCrisis",
              )}
            />{" "}
            Стабильно повышено
          </label>

          <label>
            <input
              type="radio"
              value="crisis"
              {...register(
                "secondaryHypertension.pheochromocytoma.stableOrCrisis",
              )}
            />{" "}
            Кризовые подъёмы
          </label>
        </div>

        <YesNo
          label="Профузная потливость в моменты повышения"
          name="secondaryHypertension.pheochromocytoma.profuseSweating"
          register={register}
        />

        <YesNo
          label="Зябкость рук и ног"
          name="secondaryHypertension.pheochromocytoma.coldExtremities"
          register={register}
        />

        <YesNo
          label="Нарушения ритма"
          name="secondaryHypertension.pheochromocytoma.arrhythmias"
          register={register}
        />
      </fieldset>
    </Field>
  );
};
