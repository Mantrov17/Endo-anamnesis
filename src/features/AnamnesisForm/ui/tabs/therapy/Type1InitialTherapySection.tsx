import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { DrugList } from "../../DrugList";

import styles from "../../styles.module.scss";

export const Type1InitialTherapySection: React.FC = () => {
  const { register, watch, control } = useFormContext<AnamnesisFormData>();

  const injectionMethod = watch("type1Diabetes.initialTherapy.injectionMethod");

  return (
    <fieldset className={styles.fieldset}>
      <legend>Терапия в дебюте</legend>

      <div className={styles.radioGroup}>
        <label>Способ введения инсулина:</label>

        <label>
          <input
            type="radio"
            value="injections"
            {...register("type1Diabetes.initialTherapy.injectionMethod")}
          />{" "}
          Многократные инъекции
        </label>

        <label>
          <input
            type="radio"
            value="pump"
            {...register("type1Diabetes.initialTherapy.injectionMethod")}
          />{" "}
          Инсулиновая помпа
        </label>
      </div>

      {injectionMethod === "injections" && (
        <div className={styles.radioGroup}>
          <label>Устройство:</label>

          <label>
            <input
              type="radio"
              value="syringe"
              {...register("type1Diabetes.initialTherapy.injectionsDevice")}
            />{" "}
            Шприц
          </label>

          <label>
            <input
              type="radio"
              value="pen"
              {...register("type1Diabetes.initialTherapy.injectionsDevice")}
            />{" "}
            Ручка
          </label>
        </div>
      )}

      {injectionMethod === "pump" && (
        <Input
          label="Модель помпы"
          {...register("type1Diabetes.initialTherapy.pumpModel")}
        />
      )}

      <fieldset
        className={`${styles.fieldset} ${styles.insulinTherapyFieldset}`}
      >
        <legend>Базальный инсулин</legend>

        <DrugList
          control={control}
          register={register}
          name="type1Diabetes.initialTherapy.basalInsulin"
          firstField="drugName"
          nameLabel="Название препарата"
          doseSuffix="ЕД"
        />
      </fieldset>

      <fieldset
        className={`${styles.fieldset} ${styles.insulinTherapyFieldset}`}
      >
        <legend>Болюсный инсулин</legend>

        <DrugList
          control={control}
          register={register}
          name="type1Diabetes.initialTherapy.bolusInsulin"
          firstField="drugName"
          nameLabel="Название препарата"
          doseSuffix="ЕД"
        />
      </fieldset>

      <Input
        label="Привычные цифры глюкозы на терапии"
        type="number"
        step="0.1"
        suffix="ммоль/л"
        {...register("type1Diabetes.initialTherapy.usualGlucoseOnTherapy")}
      />
    </fieldset>
  );
};
