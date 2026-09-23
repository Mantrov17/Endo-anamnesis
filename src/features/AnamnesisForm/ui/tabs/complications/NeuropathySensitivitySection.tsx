import React from "react";

import { type Path, useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Field } from "../../Field";

import styles from "../../styles.module.scss";

const sensitivityKeys = [
  "vibration",
  "temperature",
  "pain",
  "tactile",
  "jointMuscle",
  "achillesReflex",
  "kneeReflex",
] as const;

export const NeuropathySensitivitySection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="complications.neuropathy.sensitivity">
      <fieldset className={styles.fieldset}>
        <legend>
          Чувствительность (0 = норма, 1 = снижение, 2 = отсутствует)
        </legend>

        <div className={styles.table}>
          <div className={styles.tableRow}>
            <span>Вид</span>

            <span>Правая</span>

            <span>Левая</span>
          </div>

          {sensitivityKeys.map((key) => {
            const rightName: Path<AnamnesisFormData> = `complications.neuropathy.sensitivity.${key}.right`;

            const leftName: Path<AnamnesisFormData> = `complications.neuropathy.sensitivity.${key}.left`;

            return (
              <div key={key} className={styles.tableRow}>
                <span>{key}</span>

                <input type="number" min={0} max={2} {...register(rightName)} />

                <input type="number" min={0} max={2} {...register(leftName)} />
              </div>
            );
          })}
        </div>
      </fieldset>
    </Field>
  );
};
