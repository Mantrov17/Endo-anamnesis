import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const Type1InjectionSitesSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <Field noteKey="type1Diabetes.injectionSitesInfo">
      <fieldset className={styles.fieldset}>
        <legend>Место инъекций</legend>

        <label>
          <input
            type="checkbox"
            {...register("type1Diabetes.injectionSitesInfo.sites.abdomen")}
          />{" "}
          Живот (околопупочная область)
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type1Diabetes.injectionSitesInfo.sites.thighs")}
          />{" "}
          Наружная поверхность бедер
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type1Diabetes.injectionSitesInfo.sites.buttocks")}
          />{" "}
          Верхний наружный квадрант ягодиц
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type1Diabetes.injectionSitesInfo.sites.shoulders")}
          />{" "}
          Наружная поверхность плеч
        </label>

        <Input
          label="Частота смены места инъекции"
          {...register("type1Diabetes.injectionSitesInfo.siteChangeFrequency")}
        />

        <Input
          label="Частота смены игл"
          {...register(
            "type1Diabetes.injectionSitesInfo.needleChangeFrequency",
          )}
        />

        <fieldset className={styles.fieldset}>
          <legend>Липодистрофии</legend>

          <label>
            <input
              type="checkbox"
              {...register(
                "type1Diabetes.injectionSitesInfo.lipodystrophy.none",
              )}
            />{" "}
            Отсутствуют
          </label>

          <label>
            <input
              type="checkbox"
              {...register(
                "type1Diabetes.injectionSitesInfo.lipodystrophy.lipohypertrophy",
              )}
            />{" "}
            Липогипертрофии
          </label>

          <label>
            <input
              type="checkbox"
              {...register(
                "type1Diabetes.injectionSitesInfo.lipodystrophy.lipoatrophy",
              )}
            />{" "}
            Липоатрофии
          </label>
        </fieldset>

        <YesNo
          label="Болезненность при пальпации"
          name="type1Diabetes.injectionSitesInfo.tenderness"
          register={register}
        />

        <div className={styles.radioGroup}>
          <label>Температура кожи:</label>

          <label>
            <input
              type="radio"
              value="normal"
              {...register("type1Diabetes.injectionSitesInfo.skinTemperature")}
            />{" "}
            Нормальная
          </label>

          <label>
            <input
              type="radio"
              value="hyperthermia"
              {...register("type1Diabetes.injectionSitesInfo.skinTemperature")}
            />{" "}
            Гипертермия
          </label>
        </div>

        <div className={styles.radioGroup}>
          <label>Инфильтраты:</label>

          <label>
            <input
              type="radio"
              value="none"
              {...register("type1Diabetes.injectionSitesInfo.infiltrates")}
            />{" "}
            Отсутствуют
          </label>

          <label>
            <input
              type="radio"
              value="present"
              {...register("type1Diabetes.injectionSitesInfo.infiltrates")}
            />{" "}
            Присутствуют
          </label>
        </div>
      </fieldset>
    </Field>
  );
};
