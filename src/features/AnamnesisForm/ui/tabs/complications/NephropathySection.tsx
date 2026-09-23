import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";

import styles from "../../styles.module.scss";

export const NephropathySection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="complications.nephropathy">
      <fieldset className={styles.fieldset}>
        <legend>🫘 Нефропатия</legend>

        <Input
          label="Альбумин/креатинин мочи"
          {...register("complications.nephropathy.albuminCreatinine")}
        />

        <Input label="СКФ" {...register("complications.nephropathy.gfr")} />
      </fieldset>
    </Field>
  );
};
