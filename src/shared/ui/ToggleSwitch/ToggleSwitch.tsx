import React, { forwardRef, useId } from "react";

import styles from "./styles.module.scss";

interface ToggleSwitchProps {
  label: string;

  checked: boolean;

  onChange: (checked: boolean) => void;

  name?: string;

  disabled?: boolean;

  onBlur?: React.FocusEventHandler<HTMLInputElement>;

  onLabel?: string;

  offLabel?: string;
}

export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  (
    {
      label,
      checked,
      onChange,
      name,
      disabled = false,
      onBlur,
      onLabel = "Да",
      offLabel = "Нет",
    },
    ref,
  ) => {
    const labelId = useId();

    return (
      <div
        className={[styles.root, disabled ? styles.disabled : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <span id={labelId} className={styles.labelText}>
          {label}
        </span>

        <div className={styles.control}>
          <span
            className={[styles.stateText, checked ? styles.stateTextActive : ""]
              .filter(Boolean)
              .join(" ")}
            aria-hidden="true"
          >
            {checked ? onLabel : offLabel}
          </span>

          {/* Кликабельная область ограничена
              исключительно самим ползунком. */}

          <span className={styles.switchContainer}>
            <input
              ref={ref}
              className={styles.input}
              type="checkbox"
              role="switch"
              name={name}
              checked={checked}
              disabled={disabled}
              onBlur={onBlur}
              aria-labelledby={labelId}
              onChange={(event) => {
                onChange(event.target.checked);
              }}
            />

            <span className={styles.track} aria-hidden="true">
              <span className={styles.thumb} />
            </span>
          </span>
        </div>
      </div>
    );
  },
);

ToggleSwitch.displayName = "ToggleSwitch";
