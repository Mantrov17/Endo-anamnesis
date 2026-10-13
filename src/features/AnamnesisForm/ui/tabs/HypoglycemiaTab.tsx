import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../Field";

import { YesNo } from "../YesNo";

import styles from "../styles.module.scss";

export const HypoglycemiaTab: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const hasGlucoseBelow39 = boolFromString(
    watch("hypoglycemia.hasGlucoseBelow39"),
  );

  const severeEpisodes = boolFromString(watch("hypoglycemia.severeEpisodes"));

  return (
    <div className={styles.section}>
      <h3>Гипогликемии</h3>

      <YesNo
        label="Были ли понижения глюкозы менее 3,9 ммоль/л?"
        name="hypoglycemia.hasGlucoseBelow39"
        register={register}
      />

      {hasGlucoseBelow39 === true && (
        <>
          <Input
            label="Частота гипогликемий"
            type="number"
            suffix="эпиз./нед."
            {...register("hypoglycemia.frequencyPerWeek")}
          />

          <YesNo
            label="Сохраняла ли чувствительность к гипогликемиям?"
            name="hypoglycemia.awarenessPreserved"
            register={register}
          />

          <fieldset className={styles.fieldset}>
            <legend>Симптомы гипогликемии</legend>

            <label>
              <input
                type="checkbox"
                {...register("hypoglycemia.symptoms.hunger")}
              />{" "}
              Волчий голод
            </label>

            <label>
              <input
                type="checkbox"
                {...register("hypoglycemia.symptoms.tremor")}
              />{" "}
              Тремор
            </label>

            <label>
              <input
                type="checkbox"
                {...register("hypoglycemia.symptoms.sweating")}
              />{" "}
              Потливость (холодный пот)
            </label>

            <label>
              <input
                type="checkbox"
                {...register("hypoglycemia.symptoms.tachycardia")}
              />{" "}
              Тахикардия
            </label>

            <label>
              <input
                type="checkbox"
                {...register("hypoglycemia.symptoms.anxiety")}
              />{" "}
              Тревожность
            </label>

            <label>
              <input
                type="checkbox"
                {...register("hypoglycemia.symptoms.weakness")}
              />{" "}
              Слабость
            </label>

            <label>
              <input
                type="checkbox"
                {...register("hypoglycemia.symptoms.diplopia")}
              />{" "}
              Диплопия (двоение в глазах)
            </label>

            <label>
              <input
                type="checkbox"
                {...register("hypoglycemia.symptoms.headache")}
              />{" "}
              Головная боль
            </label>
          </fieldset>

          <Textarea
            label="Чем купирует гипогликемию?"
            {...register("hypoglycemia.reliefMethod")}
            rows={3}
          />

          <YesNo
            label="Были ли тяжёлые гипогликемии?"
            name="hypoglycemia.severeEpisodes"
            register={register}
          />

          {severeEpisodes === true && (
            <Field noteKey="hypoglycemia.severeEpisodes">
              <Textarea
                label="Подробнее о тяжёлых гипогликемиях"
                {...register("hypoglycemia.severeEpisodesDetails")}
                rows={3}
              />
            </Field>
          )}

          <Field noteKey="hypoglycemia.provokingFactors">
            <fieldset className={styles.fieldset}>
              <legend>Типичные провоцирующие факторы</legend>

              <label>
                <input
                  type="checkbox"
                  {...register(
                    "hypoglycemia.provokingFactors.physicalActivity",
                  )}
                />{" "}
                Физическая нагрузка
              </label>

              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.provokingFactors.missedMeal")}
                />{" "}
                Пропуск еды
              </label>

              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.provokingFactors.alcohol")}
                />{" "}
                Алкоголь
              </label>
            </fieldset>
          </Field>

          <YesNo
            label="Есть ли дома глюкагон?"
            name="hypoglycemia.hasGlucagon"
            register={register}
          />

          <YesNo
            label="Обучены ли близкие введению глюкагона?"
            name="hypoglycemia.familyTrained"
            register={register}
          />

          <YesNo
            label="Ночные гипогликемии"
            name="hypoglycemia.nocturnalHypoglycemia"
            register={register}
          />

          <Field
            noteKey="hypoglycemia.general"
            noteLabel="Примечание по гипогликемиям"
          >
            <div />
          </Field>
        </>
      )}
    </div>
  );
};
