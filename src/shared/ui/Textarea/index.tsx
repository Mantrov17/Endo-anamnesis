import React, { type TextareaHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={`${styles.textarea} ${className || ""}`}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
