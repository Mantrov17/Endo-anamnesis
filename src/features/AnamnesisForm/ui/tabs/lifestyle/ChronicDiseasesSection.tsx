import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const ChronicDiseasesSection: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const asthma = watch("lifestyle.asthma");

  const copd = watch("lifestyle.copd");

  return (
    <fieldset className={styles.fieldset}>
      <legend>Хронические заболевания</legend>

      <Textarea
        label="Заболевания глаз (кроме диабетических)"
        {...register("lifestyle.chronicEyeDiseases")}
        rows={2}
      />

      <YesNo
        label="Бронхиальная астма"
        name="lifestyle.asthma"
        register={register}
      />

      {asthma === true && (
        <>
          <Input
            label="Когда выявили?"
            {...register("lifestyle.asthmaDiagnosedWhen")}
          />

          <Input label="Аллерген" {...register("lifestyle.asthmaAllergen")} />
        </>
      )}

      <YesNo label="ХОБЛ" name="lifestyle.copd" register={register} />

      {copd === true && (
        <Input
          label="Что принимаете при ХОБЛ"
          {...register("lifestyle.copdMeds")}
        />
      )}
    </fieldset>
  );
};
