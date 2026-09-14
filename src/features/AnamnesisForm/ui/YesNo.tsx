import React from "react";
import type { Path, UseFormRegister } from "react-hook-form";
import type { AnamnesisFormData } from "@/shared";
import styles from "./styles.module.scss";
import { Hint } from "@/shared/ui/Hint";

const boolFromString = (v: unknown): boolean | null => {
  if (v === true || v === "true") return true;
  if (v === false || v === "false") return false;
  return null;
};

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
}) => (
  <div className={styles.radioGroup}>
    <label className={blue ? styles.blueLabel : undefined}>
      {label} {hint && <Hint text={hint} />}
    </label>
    <label>
      <input
        type="radio"
        value="true"
        {...register(name, { setValueAs: boolFromString })}
      />{" "}
      {yesNoLabels[0]}
    </label>
    <label>
      <input
        type="radio"
        value="false"
        {...register(name, { setValueAs: boolFromString })}
      />{" "}
      {yesNoLabels[1]}
    </label>
  </div>
);
