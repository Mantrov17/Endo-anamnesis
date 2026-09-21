import React from "react";
import { useFormContext } from "react-hook-form";
import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Field } from "../Field";
import { YesNo } from "../YesNo";
import styles from "../styles.module.scss";

export const HypoglycemiaTab: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  return (
    <div className={styles.section}>
      <h3>Гипогликемии</h3>
      <Input
        label="Частота гипогликемий"
        type="number"
        suffix="эпиз./нед."
        {...register("hypoglycemia.frequencyPerWeek")}
      />
      <YesNo
        label="Были ли тяжёлые эпизоды?"
        name="hypoglycemia.severeEpisodes"
        register={register}
      />
      {watch("hypoglycemia.severeEpisodes") === true && (
        <Field noteKey="hypoglycemia.severeEpisodes">
          <>
            <Input
              label="Количество"
              type="number"
              suffix="эпиз."
              {...register("hypoglycemia.severeEpisodesCount")}
            />
            <Input
              label="Когда (дата)"
              {...register("hypoglycemia.severeEpisodesWhen")}
            />
            <Textarea
              label="Клиника"
              {...register("hypoglycemia.severeEpisodesClinic")}
              rows={2}
            />
          </>
        </Field>
      )}
      <YesNo
        label="Сохранено ли распознавание гипогликемии?"
        name="hypoglycemia.awarenessPreserved"
        register={register}
      />

      <div className={styles.radioGroup}>
        <label>Тяжесть гипогликемий:</label>
        <label>
          <input
            type="radio"
            value="mild"
            {...register("hypoglycemia.severity")}
          />{" "}
          Лёгкие
        </label>
        <label>
          <input
            type="radio"
            value="severe"
            {...register("hypoglycemia.severity")}
          />{" "}
          Тяжёлые (требовали помощи)
        </label>
      </div>

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

      <Field noteKey="hypoglycemia.provokingFactors">
        <fieldset className={styles.fieldset}>
          <legend>Типичные провоцирующие факторы</legend>
          <label>
            <input
              type="checkbox"
              {...register("hypoglycemia.provokingFactors.physicalActivity")}
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
    </div>
  );
};
