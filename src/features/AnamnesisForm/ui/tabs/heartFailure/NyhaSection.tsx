import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Field } from "../../Field";

import styles from "../../styles.module.scss";

export const NyhaSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="heartFailure.nyhaClass">
      <fieldset className={styles.fieldset}>
        <legend>Стадия по NYHA</legend>

        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              value="I"
              {...register("heartFailure.nyhaClass")}
            />{" "}
            I — скрытая НК
          </label>

          <label>
            <input
              type="radio"
              value="IIA"
              {...register("heartFailure.nyhaClass")}
            />{" "}
            IIA — прогрессирующее снижение толерантности
          </label>

          <label>
            <input
              type="radio"
              value="IIB"
              {...register("heartFailure.nyhaClass")}
            />{" "}
            IIB — выраженные признаки в покое
          </label>

          <label>
            <input
              type="radio"
              value="III"
              {...register("heartFailure.nyhaClass")}
            />{" "}
            III — конечная
          </label>
        </div>
      </fieldset>
    </Field>
  );
};
