import React from "react";

import {
  type Path,
  type UseFormRegister,
  useFormContext,
} from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { Hint } from "@/shared/ui/Hint";

import styles from "./styles.module.scss";

interface YesNoProps {
  label: string;

  hint?: string;

  name: Path<AnamnesisFormData>;

  register: UseFormRegister<AnamnesisFormData>;

  blue?: boolean;

  yesNoLabels?: [string, string];
}

export const YesNo: React.FC<YesNoProps> = ({
  label,
  hint,
  name,
  register,
  blue,
  yesNoLabels = ["Да", "Нет"],
}) => {
  const { watch } = useFormContext<AnamnesisFormData>();

  const currentValue = boolFromString(watch(name));

  return (
    <div className={styles.radioGroup}>
      <label className={blue ? styles.blueLabel : undefined}>
        {label} {hint && <Hint text={hint} />}
      </label>

      <label>
        <input
          type="radio"
          value="true"
          checked={currentValue === true}
          {...register(name, {
            setValueAs: boolFromString,
          })}
        />{" "}
        {yesNoLabels[0]}
      </label>

      <label>
        <input
          type="radio"
          value="false"
          checked={currentValue === false}
          {...register(name, {
            setValueAs: boolFromString,
          })}
        />{" "}
        {yesNoLabels[1]}
      </label>
    </div>
  );
};
