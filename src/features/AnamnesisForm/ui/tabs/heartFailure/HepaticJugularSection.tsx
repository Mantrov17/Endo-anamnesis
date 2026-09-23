import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Field } from "../../Field";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const HepaticJugularSection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <Field noteKey="heartFailure.hepatomegaly">
        <fieldset className={styles.fieldset}>
          <legend>Гепатомегалия</legend>

          <YesNo
            label="Чувствуете боли/дискомфорт в правом подреберье?"
            name="heartFailure.hepatomegaly.rightHypochondriumPain"
            register={register}
          />

          <div className={styles.radioGroup}>
            <label>Размер печени:</label>

            <label>
              <input
                type="radio"
                value="enlarged"
                {...register("heartFailure.hepatomegaly.liverSize")}
              />{" "}
              Увеличена
            </label>

            <label>
              <input
                type="radio"
                value="notPalpable"
                {...register("heartFailure.hepatomegaly.liverSize")}
              />{" "}
              Не пальпируется
            </label>
          </div>

          <div className={styles.radioGroup}>
            <label>Край:</label>

            <label>
              <input
                type="radio"
                value="smooth"
                {...register("heartFailure.hepatomegaly.liverEdge")}
              />{" "}
              Гладкий
            </label>

            <label>
              <input
                type="radio"
                value="bumpy"
                {...register("heartFailure.hepatomegaly.liverEdge")}
              />{" "}
              Бугристый
            </label>

            <label>
              <input
                type="radio"
                value="notDefined"
                {...register("heartFailure.hepatomegaly.liverEdge")}
              />{" "}
              Не определяется
            </label>
          </div>

          <YesNo
            label="Болезненность"
            name="heartFailure.hepatomegaly.liverPainful"
            register={register}
          />

          <YesNo
            label="Придаточная пульсация"
            name="heartFailure.hepatomegaly.hepaticPulsation"
            register={register}
          />

          <YesNo
            label="Гепатоеюнальный рефлюкс"
            name="heartFailure.hepatomegaly.hepatojugularReflux"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="heartFailure.jugularVeins">
        <fieldset className={styles.fieldset}>
          <legend>Набухание яремных вен (голова 45°)</legend>

          <YesNo
            label="На вдохе и выдохе"
            name="heartFailure.jugularVeins.onInspirationAndExpiration"
            register={register}
          />

          <YesNo
            label="Только на вдохе"
            name="heartFailure.jugularVeins.onlyOnInspiration"
            register={register}
          />
        </fieldset>
      </Field>
    </>
  );
};
