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
  const { register, watch, setValue } = useFormContext<AnamnesisFormData>();

  const hasGlucoseBelow39 = boolFromString(
    watch("hypoglycemia.hasGlucoseBelow39"),
  );

  const severeEpisodes = boolFromString(watch("hypoglycemia.severeEpisodes"));

  const handleSevereEpisodesChange = (value: boolean) => {
    setValue("hypoglycemia.severeEpisodes", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

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

          {/* Метод купирования гипогликемии.
              Компактная ширина поля.
              Существующий ключ данных сохраняется. */}

          <div className={styles.hypoglycemiaReliefField}>
            <Textarea
              label="Метод купирования гипогликемии"
              {...register("hypoglycemia.reliefMethod")}
              rows={2}
            />
          </div>

          {/* Типичные провоцирующие факторы */}

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

          {/* Эпизоды тяжёлой гипогликемии.
              Располагаются ПОСЛЕ провоцирующих факторов. */}

          <div className={styles.hypoglycemiaSevereGroup}>
            <div
              id="hypoglycemia-severe-label"
              className={styles.hypoglycemiaSevereLabel}
            >
              Эпизоды тяжёлой гипогликемии
            </div>

            <div
              className={[
                styles.hypoglycemiaSevereToggle,
                severeEpisodes === true
                  ? styles.hypoglycemiaSevereToggleYes
                  : "",
                severeEpisodes === false
                  ? styles.hypoglycemiaSevereToggleNo
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="radiogroup"
              aria-labelledby="hypoglycemia-severe-label"
            >
              <label className={styles.hypoglycemiaSevereOption}>
                <input
                  type="radio"
                  name="hypoglycemia-severe-episodes-toggle"
                  value="yes"
                  checked={severeEpisodes === true}
                  onChange={() => handleSevereEpisodesChange(true)}
                />

                <span>Да</span>
              </label>

              <label className={styles.hypoglycemiaSevereOption}>
                <input
                  type="radio"
                  name="hypoglycemia-severe-episodes-toggle"
                  value="no"
                  checked={severeEpisodes === false}
                  onChange={() => handleSevereEpisodesChange(false)}
                />

                <span>Нет</span>
              </label>
            </div>
          </div>

          {/* Подробности показываем только при ответе "Да".
              При переключении на "Нет" старый текст
              не удаляется из данных. */}

          {severeEpisodes === true && (
            <Field noteKey="hypoglycemia.severeEpisodes">
              <Textarea
                label="Подробнее о тяжёлых гипогликемиях"
                placeholder="Укажите количество эпизодов, время возникновения и клинические проявления"
                {...register("hypoglycemia.severeEpisodesDetails")}
                rows={3}
              />
            </Field>
          )}

          {/* Остальные три вопроса удалены из интерфейса.
              Их значения в данных сохраняются. */}

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
