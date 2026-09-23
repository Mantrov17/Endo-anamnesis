import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../../Field";

export const MedicationTriggersSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <Field noteKey="secondaryHypertension.nsaids">
        <Textarea
          label="Как часто принимаете НПВС и парацетамол?"
          {...register("secondaryHypertension.nsaidsFrequency")}
          rows={2}
        />
      </Field>

      <Field noteKey="secondaryHypertension.decongestants">
        <Textarea
          label="Как часто принимаете деконгестанты?"
          {...register("secondaryHypertension.decongestantsFrequency")}
          rows={2}
        />
      </Field>

      <Field noteKey="secondaryHypertension.otherDrugs">
        <Textarea
          label="Другие препараты (антидепрессанты, ГКС, КОКи, бронхолитики и т.д.)"
          {...register("secondaryHypertension.otherDrugs")}
          rows={3}
        />
      </Field>
    </>
  );
};
