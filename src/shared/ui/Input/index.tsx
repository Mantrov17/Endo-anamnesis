import React, { type ComponentPropsWithRef, useId } from "react";

import styles from "./styles.module.scss";

type InputProps = ComponentPropsWithRef<"input"> & {
  label?: string;
  error?: string;
  suffix?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  suffix,
  className,
  id,
  ref,

  "aria-describedby": ariaDescribedBy,

  "aria-invalid": ariaInvalid,

  ...props
}) => {
  const generatedId = useId();

  const inputId = id ?? `input-${generatedId}`;

  const errorId = error ? `${inputId}-error` : undefined;

  const suffixId = suffix ? `${inputId}-suffix` : undefined;

  const describedBy = [ariaDescribedBy, suffixId, errorId]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  const inputClassName = [
    styles.input,

    suffix ? styles.withSuffix : undefined,

    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          className={inputClassName}
          aria-describedby={describedBy || undefined}
          aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        />

        {suffix && (
          <span id={suffixId} className={styles.suffix}>
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};
