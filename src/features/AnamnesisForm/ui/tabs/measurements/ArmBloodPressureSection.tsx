import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const ArmBloodPressureSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <YesNo
        label="Условия выполнены (не принимали антигипертензивные за 2 ч, не курили за 1 ч, не пили чай/кофе/алкоголь за 1 ч)"
        name="measurements.conditionsMet"
        register={register}
      />

      <Field noteKey="measurements.bpArms">
        <fieldset className={styles.fieldset}>
          <legend>АД на двух руках (мм рт. ст.)</legend>

          <div className={styles.row}>
            <Input
              label="Левая — систолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpArms.leftSystolic")}
            />

            <Input
              label="Левая — диастолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpArms.leftDiastolic")}
            />
          </div>

          <div className={styles.row}>
            <Input
              label="Правая — систолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpArms.rightSystolic")}
            />

            <Input
              label="Правая — диастолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpArms.rightDiastolic")}
            />
          </div>

          <Input
            label="Пульсовое давление (авторасчёт)"
            suffix="мм рт. ст."
            {...register("measurements.pulsePressure")}
            readOnly
          />
        </fieldset>
      </Field>
    </>
  );
};
