import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const PulseSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <Field noteKey="measurements.pulseOximetry">
        <fieldset className={styles.fieldset}>
          <legend>Пульсоксиметр</legend>

          <div className={styles.row}>
            <Input
              label="Левая рука"
              type="number"
              suffix="%"
              {...register("measurements.pulseOximetry.leftHand")}
            />

            <Input
              label="Правая рука"
              type="number"
              suffix="%"
              {...register("measurements.pulseOximetry.rightHand")}
            />
          </div>
        </fieldset>
      </Field>

      <Field noteKey="measurements.pulsePalpation">
        <fieldset className={styles.fieldset}>
          <legend>Пальпация пульса</legend>

          <div className={styles.radioGroup}>
            <label>На лучевой артерии — ритм:</label>

            <label>
              <input
                type="radio"
                value="regular"
                {...register("measurements.pulsePalpation.radialArtery.rhythm")}
              />{" "}
              Регулярный
            </label>

            <label>
              <input
                type="radio"
                value="irregular"
                {...register("measurements.pulsePalpation.radialArtery.rhythm")}
              />{" "}
              Нерегулярный
            </label>
          </div>

          <div className={styles.radioGroup}>
            <label>Симметричность:</label>

            <label>
              <input
                type="radio"
                value="symmetric"
                {...register(
                  "measurements.pulsePalpation.radialArtery.symmetry",
                )}
              />{" "}
              Симметричный
            </label>

            <label>
              <input
                type="radio"
                value="asymmetric"
                {...register(
                  "measurements.pulsePalpation.radialArtery.symmetry",
                )}
              />{" "}
              Несимметричный
            </label>
          </div>

          <YesNo
            label="Задняя большеберцовая артерия слева пальпируется?"
            name="measurements.pulsePalpation.posteriorTibialArtery.left"
            register={register}
          />

          <YesNo
            label="Задняя большеберцовая артерия справа пальпируется?"
            name="measurements.pulsePalpation.posteriorTibialArtery.right"
            register={register}
          />

          <YesNo
            label="Тыльная артерия стопы слева пальпируется?"
            name="measurements.pulsePalpation.dorsalisPedisArtery.left"
            register={register}
          />

          <YesNo
            label="Тыльная артерия стопы справа пальпируется?"
            name="measurements.pulsePalpation.dorsalisPedisArtery.right"
            register={register}
          />
        </fieldset>
      </Field>
    </>
  );
};
