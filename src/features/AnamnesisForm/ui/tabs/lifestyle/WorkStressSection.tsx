import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const WorkStressSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="lifestyle.work">
      <fieldset className={styles.fieldset}>
        <legend>Работа и стресс</legend>

        <Input label="Кем работаете?" {...register("lifestyle.occupation")} />

        <YesNo
          label="Сидячая работа?"
          name="lifestyle.sedentaryWork"
          register={register}
        />

        <YesNo
          label="Много стресса?"
          name="lifestyle.stress"
          register={register}
        />
      </fieldset>
    </Field>
  );
};
