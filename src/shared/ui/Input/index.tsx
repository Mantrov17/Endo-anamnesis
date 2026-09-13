import React, { type InputHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  suffix,
  className,
  ...props
}) => {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        <input
          className={`${styles.input} ${suffix ? styles.withSuffix : ""} ${
            className || ""
          }`}
          {...props}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
