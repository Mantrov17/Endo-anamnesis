import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { DrugList } from "../../DrugList";

import { Field } from "../../Field";

import styles from "../../styles.module.scss";

export const Type2InitialTherapySection: React.FC = () => {
  const { register, control } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="type2Diabetes.initialTherapy">
      <fieldset className={styles.fieldset}>
        <legend>Терапия в дебюте</legend>

        <DrugList
          control={control}
          register={register}
          name="type2Diabetes.initialTherapy"
          firstField="drugName"
          nameLabel="Название препарата"
          showFrequency
        />
      </fieldset>
    </Field>
  );
};
