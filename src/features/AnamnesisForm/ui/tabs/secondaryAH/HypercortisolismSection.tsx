import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const HypercortisolismSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="secondaryHypertension.hypercortisolism">
      <fieldset className={styles.fieldset}>
        <legend>Гиперкортицизм (синдром Кушинга)</legend>

        <YesNo
          label="Центральное ожирение"
          name="secondaryHypertension.hypercortisolism.centralObesity"
          register={register}
        />

        <YesNo
          label="Лунообразное лицо"
          name="secondaryHypertension.hypercortisolism.moonFace"
          register={register}
        />

        <YesNo
          label="Румянец на щеках"
          name="secondaryHypertension.hypercortisolism.cheekFlush"
          register={register}
        />

        <YesNo
          label="Горб буйвола"
          name="secondaryHypertension.hypercortisolism.buffaloHump"
          register={register}
        />

        <YesNo
          label="Синяки"
          name="secondaryHypertension.hypercortisolism.bruises"
          register={register}
        />

        <YesNo
          label="Проксимальная мышечная слабость"
          name="secondaryHypertension.hypercortisolism.proximalWeakness"
          register={register}
        />

        <YesNo
          label="Широкие и глубокие стрии"
          name="secondaryHypertension.hypercortisolism.striae"
          register={register}
        />

        <YesNo
          label="Вновь начавшийся СД (приём ГКС)"
          name="secondaryHypertension.hypercortisolism.newDiabetes"
          register={register}
        />

        <YesNo
          label="Аменорея"
          name="secondaryHypertension.hypercortisolism.amenorrhea"
          register={register}
        />
      </fieldset>
    </Field>
  );
};
