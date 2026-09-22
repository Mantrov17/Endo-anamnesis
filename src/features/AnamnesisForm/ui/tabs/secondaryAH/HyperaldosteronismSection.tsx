import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const HyperaldosteronismSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="secondaryHypertension.hyperaldosteronism">
      <fieldset className={styles.fieldset}>
        <legend>Гиперальдостеронизм</legend>

        <YesNo
          label="Полидипсия / полиурия"
          name="secondaryHypertension.hyperaldosteronism.polydipsiaPolyuria"
          register={register}
        />

        <YesNo
          label="Преходящая мышечная слабость"
          name="secondaryHypertension.hyperaldosteronism.muscleWeakness"
          register={register}
        />

        <YesNo
          label="Судороги конечностей"
          name="secondaryHypertension.hyperaldosteronism.limbCramps"
          register={register}
        />

        <YesNo
          label="Запоры"
          name="secondaryHypertension.hyperaldosteronism.constipation"
          register={register}
        />
      </fieldset>
    </Field>
  );
};
