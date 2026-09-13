import React from "react";
import styles from "./styles.module.scss";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  label?: string;
  error?: string;
  // Для react-hook-form
  register?: any;
  // Для управляемого режима
  value?: string;
  onChange?: (name: string, value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  label,
  error,
  register,
  value,
  onChange,
}) => {
  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <div className={styles.radioGroup}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.options}>
        {options.map((option) => {
          let inputProps: React.InputHTMLAttributes<HTMLInputElement> = {};

          if (isControlled) {
            inputProps = {
              checked: value === option.value,
              onChange: () => onChange(name, option.value),
            };
          } else if (register) {
            // Если register передан, используем его (он возвращает onChange, onBlur, ref и т.д.)
            const reg = register(name);
            inputProps = {
              ...reg,
              value: option.value,
            };
          } else {
            inputProps = {
              name,
              value: option.value,
            };
          }

          return (
            <label key={option.value} className={styles.option}>
              <input type="radio" {...inputProps} />
              {option.label}
            </label>
          );
        })}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
