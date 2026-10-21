import React, { useId, useState } from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import styles from "./EyesAcuityFields.module.scss";

type Eye = "OU" | "OS" | "OD";

type SignPath =
  | "eyes.visualAcuitySign"
  | "eyes.visualAcuityByEye.OS.sign"
  | "eyes.visualAcuityByEye.OD.sign";

type ValuePath =
  | "eyes.visualAcuityValue"
  | "eyes.visualAcuityByEye.OS.value"
  | "eyes.visualAcuityByEye.OD.value";

const FIELDS: Record<Eye, { sign: SignPath; value: ValuePath }> = {
  OU: {
    sign: "eyes.visualAcuitySign",
    value: "eyes.visualAcuityValue",
  },
  OS: {
    sign: "eyes.visualAcuityByEye.OS.sign",
    value: "eyes.visualAcuityByEye.OS.value",
  },
  OD: {
    sign: "eyes.visualAcuityByEye.OD.sign",
    value: "eyes.visualAcuityByEye.OD.value",
  },
};

const AcuityRow: React.FC<{ eye: Eye }> = ({ eye }) => {
  const { register } = useFormContext<AnamnesisFormData>();
  const id = useId();
  const { sign, value } = FIELDS[eye];

  return (
    <div className={styles.row}>
      <span className={styles.eyeLabel}>
        Глаз: <strong>{eye}</strong>
      </span>

      <fieldset className={styles.signFieldset}>
        <legend>Знак</legend>
        <div className={styles.signButtons}>
          {(["+", "-"] as const).map((signValue) => (
            <label key={signValue}>
              <input type="radio" value={signValue} {...register(sign)} />
              <span>{signValue === "-" ? "−" : "+"}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className={styles.valueField} htmlFor={id}>
        <span>Значение</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          placeholder="0.5"
          {...register(value, {
            setValueAs: (raw: unknown) =>
              raw === "" || raw == null ? null : Number(raw),
          })}
        />
      </label>
    </div>
  );
};

export const EyesAcuityFields: React.FC = () => {
  const { getValues } = useFormContext<AnamnesisFormData>();
  const detailsId = useId();

  const [expanded, setExpanded] = useState(() => {
    const details = getValues("eyes.visualAcuityByEye");

    return Boolean(
      details?.OS?.sign ||
        details?.OS?.value != null ||
        details?.OD?.sign ||
        details?.OD?.value != null,
    );
  });

  return (
    <div className={styles.container}>
      <AcuityRow eye="OU" />

      <button
        className={styles.expandButton}
        type="button"
        aria-expanded={expanded}
        aria-controls={detailsId}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className={`${styles.chevron} ${expanded ? styles.open : ""}`}>
          ▾
        </span>
        Отдельно по глазам (OS / OD)
      </button>

      <div id={detailsId} hidden={!expanded} className={styles.details}>
        {expanded && (
          <>
            <AcuityRow eye="OS" />
            <AcuityRow eye="OD" />
          </>
        )}
      </div>
    </div>
  );
};
