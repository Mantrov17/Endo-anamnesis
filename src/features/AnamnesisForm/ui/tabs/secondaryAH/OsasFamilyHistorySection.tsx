import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const OsasFamilyHistorySection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <Field noteKey="secondaryHypertension.osas">
        <fieldset className={styles.fieldset}>
          <legend>Синдром обструктивного апноэ сна</legend>

          <YesNo
            label="Ночной храп"
            name="secondaryHypertension.osas.nightSnoring"
            register={register}
          />

          <YesNo
            label="Просыпаетесь ли ночью?"
            name="secondaryHypertension.osas.nightAwakenings"
            register={register}
          />

          <YesNo
            label="Ночное мочеиспускание"
            name="secondaryHypertension.osas.nocturia"
            register={register}
          />

          <YesNo
            label="Дневная сонливость"
            name="secondaryHypertension.osas.daytimeSleepiness"
            register={register}
          />

          <YesNo
            label="Ожирение"
            name="secondaryHypertension.osas.obesity"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="secondaryHypertension.familyHistory">
        <fieldset className={styles.fieldset}>
          <legend>Семейный анамнез</legend>

          <YesNo
            label="Повышенное давление у родственников"
            name="secondaryHypertension.familyHistory.hypertension"
            register={register}
          />

          <YesNo
            label="Инфаркт или инсульт в молодом возрасте (муж <55, жен <65)"
            name="secondaryHypertension.familyHistory.earlyHeartAttackStroke"
            register={register}
          />

          <YesNo
            label="Феохромоцитома у родственников"
            name="secondaryHypertension.familyHistory.pheochromocytoma"
            register={register}
          />
        </fieldset>
      </Field>

      <YesNo
        label="Женщина: было ли во время беременности повышение давления, преэклампсия или эклампсия?"
        name="secondaryHypertension.pregnancyHypertension"
        register={register}
      />
    </>
  );
};
