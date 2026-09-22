import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const LegBloodPressureSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <Field noteKey="measurements.bpLegs">
        <fieldset className={styles.fieldset}>
          <legend>АД на двух ногах (мм рт. ст.)</legend>

          <div className={styles.row}>
            <Input
              label="Левая — систолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpLegs.leftSystolic")}
            />

            <Input
              label="Левая — диастолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpLegs.leftDiastolic")}
            />
          </div>

          <div className={styles.row}>
            <Input
              label="Правая — систолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpLegs.rightSystolic")}
            />

            <Input
              label="Правая — диастолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpLegs.rightDiastolic")}
            />
          </div>

          <div className={styles.row}>
            <Input
              label="ЛПИ слева (авторасчёт)"
              {...register("measurements.abiIndex.left")}
              readOnly
            />

            <Input
              label="ЛПИ справа (авторасчёт)"
              {...register("measurements.abiIndex.right")}
              readOnly
            />
          </div>
        </fieldset>
      </Field>

      <Field noteKey="measurements.limbs">
        <fieldset className={styles.fieldset}>
          <legend>Боли при ходьбе / конечности</legend>

          <YesNo
            label="Боли при ходьбе в ногах/икрах"
            name="measurements.legPainWalking"
            register={register}
          />

          <YesNo
            label="Проходят ли боли после остановки?"
            name="measurements.painStopsAfterRest"
            register={register}
          />

          <Input
            label="Сколько можете пройти без остановки"
            {...register("measurements.walkingDistance")}
          />

          <Input
            label="Цвет конечностей"
            {...register("measurements.limbColor")}
          />

          <Input
            label="Температура"
            {...register("measurements.limbTemperature")}
          />

          <Input label="Кожа" {...register("measurements.limbSkin")} />
        </fieldset>
      </Field>
    </>
  );
};
