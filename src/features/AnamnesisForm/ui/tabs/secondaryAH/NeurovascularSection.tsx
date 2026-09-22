import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Textarea } from "@/shared/ui/Textarea";

import { YesNo } from "../../YesNo";

export const NeurovascularSection: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const tia = watch("secondaryHypertension.tia");

  return (
    <>
      <YesNo
        label="Частые головные боли"
        name="secondaryHypertension.frequentHeadaches"
        register={register}
      />

      <YesNo
        label="Инсульт"
        name="secondaryHypertension.stroke"
        register={register}
      />

      <YesNo
        label="Транзиторная ишемическая атака"
        name="secondaryHypertension.tia"
        register={register}
      />

      {tia === true && (
        <Textarea
          label="Детали ТИА"
          {...register("secondaryHypertension.tiaDetails")}
          rows={2}
        />
      )}
    </>
  );
};
