import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const SmallCircleSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="heartFailure.smallCircle">
      <fieldset className={styles.fieldset}>
        <legend>Малый круг кровообращения</legend>

        <YesNo
          label="Во время сна подкладываете подушки под спину?"
          name="heartFailure.smallCircle.pillowsForSleep"
          register={register}
        />

        <YesNo
          label="Усиливается ли одышка ночью? Просыпаетесь ли из-за одышки?"
          name="heartFailure.smallCircle.nightDyspnea"
          register={register}
        />

        <label>Акроцианоз:</label>

        <label>
          <input
            type="checkbox"
            {...register(
              "heartFailure.smallCircle.acrocyanosis.nasolabialTriangle",
            )}
          />{" "}
          Носогубный треугольник
        </label>

        <label>
          <input
            type="checkbox"
            {...register("heartFailure.smallCircle.acrocyanosis.hands")}
          />{" "}
          Кисти
        </label>

        <label>
          <input
            type="checkbox"
            {...register("heartFailure.smallCircle.acrocyanosis.feet")}
          />{" "}
          Стопы
        </label>

        <Input
          label="Сатурация"
          type="number"
          suffix="%"
          {...register("heartFailure.smallCircle.saturation")}
        />
      </fieldset>
    </Field>
  );
};
