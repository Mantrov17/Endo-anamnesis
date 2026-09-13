import React from "react";
import styles from "./styles.module.scss";

interface CheckboxProps {
  name: string;
  register: any;
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  register,
  label,
}) => {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" {...register(name)} />
      {label}
    </label>
  );
};
