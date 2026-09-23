import React from "react";

import styles from "./styles.module.scss";

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;

  options: RadioOption[];

  value: string;

  onChange: (value: string) => void;

  label?: string;

  error?: string;

  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  disabled = false,
}) => {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className={styles.radioGroup}>
      {label && <div className={styles.label}>{label}</div>}

      <div
        className={styles.options}
        role="radiogroup"
        aria-label={label}
        aria-describedby={errorId}
      >
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled}
            />

            {option.label}
          </label>
        ))}
      </div>

      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};
