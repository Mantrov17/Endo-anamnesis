import React, { type ComponentPropsWithRef, useId } from "react";

import styles from "./styles.module.scss";

type TextareaProps = ComponentPropsWithRef<"textarea"> & {
  label?: string;
  error?: string;
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className,
  id,
  ref,

  "aria-describedby": ariaDescribedBy,

  "aria-invalid": ariaInvalid,

  ...props
}) => {
  const generatedId = useId();

  const textareaId = id ?? `textarea-${generatedId}`;

  const errorId = error ? `${textareaId}-error` : undefined;

  const describedBy = [ariaDescribedBy, errorId]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  const textareaClassName = [styles.textarea, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}

      <textarea
        {...props}
        ref={ref}
        id={textareaId}
        className={textareaClassName}
        aria-describedby={describedBy || undefined}
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
      />

      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};
