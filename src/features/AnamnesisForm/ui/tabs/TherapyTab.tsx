import React from "react";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Field } from "../Field";
import { YesNo } from "../YesNo";
import { DrugList } from "../DrugList";
import type { TabProps } from "./types";
import styles from "../styles.module.scss";

export const TherapyTab: React.FC<TabProps> = ({
  register,
  watch,
  control,
}) => {
  const isType1 = watch("primaryExam.suspectedDiagnosis") === "type1";
  const isType2 = watch("primaryExam.suspectedDiagnosis") === "type2";
  const type1Data = watch("type1Diabetes");
  const type2Data = watch("type2Diabetes");

  return (
    <div className={styles.section}>
      <h3>Терапия</h3>
      <Input
        label="Целевой уровень гликированного гемоглобина"
        suffix="%"
        {...register("therapy.targetHba1c")}
        readOnly
      />
      {/* ===== Терапия в дебюте — СД 1 типа ===== */}
      {isType1 && type1Data && (
        <>
          <Field noteKey="type1Diabetes.initialTherapy">
            <fieldset className={styles.fieldset}>
              <legend>Терапия в дебюте</legend>
              <DrugList
                control={control}
                register={register}
                name="type1Diabetes.initialTherapy"
                firstField="drugName"
                nameLabel="Название препарата"
              />
            </fieldset>
          </Field>

          <YesNo
            label="Данную терапию принимаете до сих пор?"
            name="type1Diabetes.stillTakingInitialTherapy"
            register={register}
          />
          {watch("type1Diabetes.stillTakingInitialTherapy") === false && (
            <Field noteKey="type1Diabetes.ifNotTakingReason">
              <Textarea
                label="Что изменилось?"
                {...register("type1Diabetes.ifNotTakingReason")}
                rows={2}
              />
            </Field>
          )}
        </>
      )}

      {/* ===== Терапия в дебюте — СД 2 типа ===== */}
      {isType2 && type2Data && (
        <>
          <Field noteKey="type2Diabetes.initialTherapy">
            <fieldset className={styles.fieldset}>
              <legend>Терапия в дебюте</legend>
              <DrugList
                control={control}
                register={register}
                name="type2Diabetes.initialTherapy"
                firstField="drugName"
                nameLabel="Название препарата"
              />
            </fieldset>
          </Field>

          <YesNo
            label="Данную терапию принимаете до сих пор?"
            name="type2Diabetes.stillTakingInitialTherapy"
            register={register}
          />
          {watch("type2Diabetes.stillTakingInitialTherapy") === false && (
            <Field noteKey="type2Diabetes.ifNotTakingReason">
              <Textarea
                label="Что изменилось?"
                {...register("type2Diabetes.ifNotTakingReason")}
                rows={2}
              />
            </Field>
          )}
        </>
      )}
      <fieldset className={styles.fieldset}>
        <legend>Актуальная терапия</legend>

        <YesNo
          label="Совпадает с терапией в дебюте?"
          name="actualTherapy.sameAsInitial"
          register={register}
        />

        {watch("actualTherapy.sameAsInitial") === false && (
          <>
            <div className={styles.radioGroup}>
              <label>Способ введения инсулина:</label>
              <label>
                <input
                  type="radio"
                  value="injections"
                  {...register("actualTherapy.injectionMethod")}
                />{" "}
                Многократные инъекции
              </label>
              <label>
                <input
                  type="radio"
                  value="pump"
                  {...register("actualTherapy.injectionMethod")}
                />{" "}
                Инсулиновая помпа
              </label>
            </div>

            {watch("actualTherapy.injectionMethod") === "injections" && (
              <div className={styles.radioGroup}>
                <label>Устройство:</label>
                <label>
                  <input
                    type="radio"
                    value="syringe"
                    {...register("actualTherapy.injectionsDevice")}
                  />{" "}
                  Шприц
                </label>
                <label>
                  <input
                    type="radio"
                    value="pen"
                    {...register("actualTherapy.injectionsDevice")}
                  />{" "}
                  Ручка
                </label>
              </div>
            )}

            {watch("actualTherapy.injectionMethod") === "pump" && (
              <Input
                label="Модель помпы"
                {...register("actualTherapy.pumpModel")}
              />
            )}

            <fieldset className={styles.fieldset}>
              <legend>Базальный инсулин</legend>
              <DrugList
                control={control}
                register={register}
                name="actualTherapy.basalInsulin"
                firstField="name"
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Болюсный инсулин</legend>
              <DrugList
                control={control}
                register={register}
                name="actualTherapy.bolusInsulin"
                firstField="name"
              />
            </fieldset>

            <div className={styles.radioGroup}>
              <label>Коэффициент (по длительности СД):</label>
              <label>
                <input
                  type="radio"
                  value="0.5"
                  {...register("actualTherapy.insulinDoseCoefficient", {
                    setValueAs: (v) => (v === "" ? null : Number(v)),
                  })}
                />{" "}
                0.5 (&lt;5 лет)
              </label>
              <label>
                <input
                  type="radio"
                  value="0.7"
                  {...register("actualTherapy.insulinDoseCoefficient", {
                    setValueAs: (v) => (v === "" ? null : Number(v)),
                  })}
                />{" "}
                0.7 (5–10 лет)
              </label>
              <label>
                <input
                  type="radio"
                  value="0.9"
                  {...register("actualTherapy.insulinDoseCoefficient", {
                    setValueAs: (v) => (v === "" ? null : Number(v)),
                  })}
                />{" "}
                0.9 (&gt;10 лет)
              </label>
            </div>

            <Input
              label="Расчётная суточная доза инсулина (авторасчёт)"
              readOnly
              suffix="Ед"
              {...register("actualTherapy.calculatedDailyInsulinDose")}
            />

            <Textarea
              label="Другие сахаропонижающие препараты"
              {...register("actualTherapy.otherGlucoseLoweringDrugs")}
              rows={2}
            />
            <Textarea
              label="Места инъекций"
              {...register("actualTherapy.injectionSites")}
              rows={2}
            />
            <YesNo
              label="Наличие липогипертрофии"
              name="actualTherapy.lipohypertrophy"
              register={register}
            />
          </>
        )}
      </fieldset>

      <Field noteKey="therapy.currentDrugs">
        <fieldset className={styles.fieldset}>
          <legend>Сахаропонижающие препараты (кроме инсулина)</legend>
          <DrugList
            control={control}
            register={register}
            name="therapy.currentDrugs"
            firstField="name"
          />
        </fieldset>
      </Field>

      <Field noteKey="therapy.basalInsulin">
        <fieldset className={styles.fieldset}>
          <legend>Базальный инсулин</legend>
          <DrugList
            control={control}
            register={register}
            name="therapy.basalInsulin"
            firstField="name"
          />
        </fieldset>
      </Field>

      <Field noteKey="therapy.prandialInsulin">
        <fieldset className={styles.fieldset}>
          <legend>Прандиальный (болюсный) инсулин</legend>
          <DrugList
            control={control}
            register={register}
            name="therapy.prandialInsulin"
            firstField="name"
          />
        </fieldset>
      </Field>

      <YesNo
        label="Используется ли подсчёт углеводов?"
        name="therapy.carbCounting"
        register={register}
      />
      {watch("therapy.carbCounting") === true && (
        <Input
          label="Углеводный коэффициент"
          {...register("therapy.carbRatio")}
        />
      )}
      <Field noteKey="therapy.injectionSites">
        <Textarea
          label="Места инъекций"
          {...register("therapy.injectionSites")}
          rows={2}
        />
      </Field>
      <YesNo
        label="Наличие липогипертрофии"
        name="therapy.lipohypertrophy"
        register={register}
      />
      <Field noteKey="therapy.general" noteLabel="Примечание по терапии">
        <div />
      </Field>
    </div>
  );
};
