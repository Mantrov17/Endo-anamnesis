import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { Textarea } from "@/shared/ui/Textarea";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

interface ActualTherapySectionProps {
  hideTitle?: boolean;
}

export const ActualTherapySection: React.FC<ActualTherapySectionProps> = ({
  hideTitle = false,
}) => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const sameAsInitial = boolFromString(watch("actualTherapy.sameAsInitial"));

  return (
    <fieldset className={styles.fieldset}>
      {!hideTitle && <legend>Актуальная терапия</legend>}

      <YesNo
        label="Совпадает с терапией в дебюте?"
        name="actualTherapy.sameAsInitial"
        register={register}
      />

      {sameAsInitial === false && (
        <>
          <Textarea
            label="Причина коррекции терапии"
            {...register("actualTherapy.correctionReason")}
            rows={2}
          />

          <Textarea
            label="Скорректированная терапия"
            {...register("actualTherapy.correctedTherapy")}
            rows={2}
          />
        </>
      )}
    </fieldset>
  );
};
