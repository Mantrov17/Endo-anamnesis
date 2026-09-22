import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const NeuropathyVeinsSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field
      noteKey="complications.neuropathy.veins"
      noteLabel="Примечание по венам / стопам"
    >
      <fieldset className={styles.fieldset}>
        <legend>Вены нижних конечностей</legend>

        <YesNo
          label="Лимфедема"
          name="complications.neuropathy.lymphedema"
          register={register}
        />

        <Textarea
          label="Симптом Ласега (детали)"
          {...register("complications.neuropathy.lasegueDetails")}
          rows={2}
        />

        <Textarea
          label="Осмотр стоп, наличие язв в анамнезе"
          {...register("complications.neuropathy.footExamNotes")}
          rows={3}
        />

        <Textarea
          label="Когда появилась рана?"
          {...register("complications.neuropathy.woundAppearance")}
          rows={2}
        />
      </fieldset>
    </Field>
  );
};
