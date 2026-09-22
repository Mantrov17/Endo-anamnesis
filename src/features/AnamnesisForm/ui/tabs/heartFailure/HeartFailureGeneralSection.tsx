import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const HeartFailureGeneralSection: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <YesNo
        label="Изменение цвета мочи?"
        name="heartFailure.urineColorChange"
        register={register}
      />

      {watch("heartFailure.urineColorChange") === true && (
        <Input label="Какой цвет?" {...register("heartFailure.urineColor")} />
      )}

      <YesNo
        label="Боли в груди / сердце"
        name="heartFailure.chestPain"
        register={register}
      />

      {watch("heartFailure.chestPain") === true && (
        <Field noteKey="heartFailure.chestPain">
          <>
            <div className={styles.radioGroup}>
              <label>Провоцирующий фактор:</label>

              <label>
                <input
                  type="radio"
                  value="none"
                  {...register("heartFailure.chestPainTrigger")}
                />{" "}
                Отсутствует
              </label>

              <label>
                <input
                  type="radio"
                  value="physical"
                  {...register("heartFailure.chestPainTrigger")}
                />{" "}
                Физ. нагрузка
              </label>

              <label>
                <input
                  type="radio"
                  value="emotional"
                  {...register("heartFailure.chestPainTrigger")}
                />{" "}
                Эмоц. стресс
              </label>

              <label>
                <input
                  type="radio"
                  value="positional"
                  {...register("heartFailure.chestPainTrigger")}
                />{" "}
                Изменение положения тела
              </label>
            </div>

            <YesNo
              label="Иррадиация в левую руку"
              name="heartFailure.radiatesToLeftArm"
              register={register}
            />

            <YesNo
              label="Проходят от нитроглицерина / фосфалюгеля"
              name="heartFailure.relievesWithNitroglycerin"
              register={register}
            />

            <YesNo
              label="За последние 3 месяца — учащение приступов?"
              name="heartFailure.frequentAttacks3Months"
              register={register}
            />
          </>
        </Field>
      )}

      <YesNo
        label="Одышка при нагрузке"
        name="heartFailure.dyspneaOnExertion"
        register={register}
      />

      {watch("heartFailure.dyspneaOnExertion") === true && (
        <div className={styles.radioGroup}>
          <label>Функциональный класс:</label>

          <label>
            <input
              type="radio"
              value="I"
              {...register("heartFailure.dyspneaFunctionalClass")}
            />{" "}
            I (чрезмерная нагрузка)
          </label>

          <label>
            <input
              type="radio"
              value="II"
              {...register("heartFailure.dyspneaFunctionalClass")}
            />{" "}
            II (умеренное ограничение, &gt;2 этажей)
          </label>

          <label>
            <input
              type="radio"
              value="III"
              {...register("heartFailure.dyspneaFunctionalClass")}
            />{" "}
            III (&lt;2 этажей)
          </label>

          <label>
            <input
              type="radio"
              value="IV"
              {...register("heartFailure.dyspneaFunctionalClass")}
            />{" "}
            IV (в покое)
          </label>
        </div>
      )}

      <YesNo
        label="Принимает тикагрелор"
        name="heartFailure.takesTicagrelor"
        register={register}
      />
    </>
  );
};
