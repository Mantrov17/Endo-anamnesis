import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const BigCircleSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="heartFailure.bigCircle">
      <fieldset className={styles.fieldset}>
        <legend>Большой круг — отёки ног</legend>

        <YesNo
          label="Отёки ног"
          name="heartFailure.bigCircle.legEdema"
          register={register}
        />

        <YesNo
          label="Теснота обуви к концу дня, след от резинки носков"
          name="heartFailure.bigCircle.tightShoes"
          register={register}
        />

        <div className={styles.radioGroup}>
          <label>Давно появились отёки?</label>

          <label>
            <input
              type="radio"
              value="long"
              {...register("heartFailure.bigCircle.edemaOnset")}
            />{" "}
            Давно
          </label>

          <label>
            <input
              type="radio"
              value="acute"
              {...register("heartFailure.bigCircle.edemaOnset")}
            />{" "}
            Остро (исключить ТГВ)
          </label>
        </div>

        <YesNo
          label="Симметричные?"
          name="heartFailure.bigCircle.symmetric"
          register={register}
        />

        <Input
          label="Локализация (стопы, голени, крестец, мошонка)"
          {...register("heartFailure.bigCircle.localization")}
        />

        <div className={styles.radioGroup}>
          <label>Время появления:</label>

          <label>
            <input
              type="radio"
              value="morning"
              {...register("heartFailure.bigCircle.timeOfDay")}
            />{" "}
            Утро
          </label>

          <label>
            <input
              type="radio"
              value="evening"
              {...register("heartFailure.bigCircle.timeOfDay")}
            />{" "}
            Вечер
          </label>
        </div>

        <YesNo
          label="Проходят ли отёки за ночь?"
          name="heartFailure.bigCircle.edemaImprovesNight"
          register={register}
        />

        <YesNo
          label="Становится ли лучше при возвышенном положении?"
          name="heartFailure.bigCircle.edemaImprovesElevation"
          register={register}
        />

        <div className={styles.row}>
          <div>
            <label>Температура</label>

            <select {...register("heartFailure.bigCircle.edemaTemperature")}>
              <option value="">—</option>
              <option value="cold">Холодная</option>
              <option value="hot">Горячая</option>
            </select>
          </div>

          <div>
            <label>Цвет</label>

            <select {...register("heartFailure.bigCircle.edemaColor")}>
              <option value="">—</option>
              <option value="pale">Бледный</option>
              <option value="cyanotic">Цианотичный</option>
              <option value="hyperemic">Гиперемия</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <label>Плотность</label>

            <select {...register("heartFailure.bigCircle.edemaDensity")}>
              <option value="">—</option>
              <option value="soft">Мягкие</option>
              <option value="dense">Плотные</option>
            </select>
          </div>

          <div>
            <label>Исчезает</label>

            <select {...register("heartFailure.bigCircle.edemaResolves")}>
              <option value="">—</option>
              <option value="immediate">Сразу</option>
              <option value="delayed">Спустя время</option>
            </select>
          </div>
        </div>

        <YesNo
          label="Ямка при нажатии"
          name="heartFailure.bigCircle.pittingEdema"
          register={register}
        />

        <YesNo
          label="Болезненность"
          name="heartFailure.bigCircle.painful"
          register={register}
        />

        <YesNo
          label="Принимает нифедипин, амлодипин, НПВС"
          name="heartFailure.bigCircle.takesNifedipineAmlodipineNsaids"
          register={register}
        />
      </fieldset>
    </Field>
  );
};
