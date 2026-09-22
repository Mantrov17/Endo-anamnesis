import React from "react";

import type { Path, UseFormRegister } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
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

const boolFromString = (value: unknown): boolean | null => {
  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  return null;
};

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
