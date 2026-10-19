import React from "react";

import { Controller, useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { DateField } from "@/shared/ui/DateInput";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { ToggleSwitch } from "@/shared/ui/ToggleSwitch";

import { Field } from "../../Field";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

import { FamilyHistoryTree } from "./FamilyHistoryTree";

import { GestationalDiabetesSection } from "./GestationalDiabetesSection";

export const Type1DiabetesSection: React.FC = () => {
  const { register, watch, setValue, control } =
    useFormContext<AnamnesisFormData>();

  const autoantibodiesTested = boolFromString(
    watch("type1Diabetes.autoantibodies.tested"),
  );

  const gadChecked = watch("type1Diabetes.autoantibodies.GAD");

  const ia2Checked = watch("type1Diabetes.autoantibodies.IA2");

  const znt8Checked = watch("type1Diabetes.autoantibodies.ZnT8");

  const iaaChecked = watch("type1Diabetes.autoantibodies.IAA");

  const cPeptideTested = boolFromString(watch("type1Diabetes.cPeptide.tested"));

  const cPeptideUnknown = watch("type1Diabetes.cPeptide.unknown") === true;

  const hba1cTestedType1 = boolFromString(watch("type1Diabetes.hba1c.tested"));

  const otherClassicSymptom =
    watch("type1Diabetes.classicSymptoms.other") === true;

  const familyHistoryDiabetes = boolFromString(
    watch("type1Diabetes.familyHistoryDiabetes"),
  );

  return (
    <div className={styles.section}>
      <h3>Дебют СД 1 типа</h3>

      <div className={styles.row}>
        <Input
          label="Год постановки диагноза"
          type="text"
          inputMode="numeric"
          maxLength={4}
          placeholder="ГГГГ"
          {...register("type1Diabetes.yearOfDiagnosis")}
        />

        <Input
          label="Возраст постановки диагноза"
          type="number"
          suffix="лет"
          {...register("type1Diabetes.ageAtDiagnosis")}
        />

        <Input
          label="Длительность заболевания"
          type="number"
          suffix="лет"
          {...register("type1Diabetes.diseaseDuration")}
        />
      </div>

      <Field noteKey="type1Diabetes.howDiagnosed">
        <div className={styles.radioGroup}>
          <label>Как был поставлен диагноз?</label>

          <label>
            <input
              type="radio"
              value="accidental"
              {...register("type1Diabetes.howDiagnosed")}
            />{" "}
            Случайная находка
          </label>

          <label>
            <input
              type="radio"
              value="planned"
              {...register("type1Diabetes.howDiagnosed")}
            />{" "}
            Плановый осмотр
          </label>

          <label>
            <input
              type="radio"
              value="dispanserization"
              {...register("type1Diabetes.howDiagnosed")}
            />{" "}
            Диспансеризация
          </label>

          <label>
            <input
              type="radio"
              value="withComplaints"
              {...register("type1Diabetes.howDiagnosed")}
            />{" "}
            Приём с жалобами
          </label>

          <label>
            <input
              type="radio"
              value="emergency"
              {...register("type1Diabetes.howDiagnosed")}
            />{" "}
            Неотложная госпитализация
          </label>
        </div>
      </Field>

      <div className={styles.onsetGlycemiaField}>
        <Input
          label="Уровень гликемии в дебюте"
          type="number"
          inputMode="decimal"
          min={0}
          max={60}
          step="0.1"
          suffix="ммоль/л"
          {...register("type1Diabetes.glycemiaAtOnset", {
            setValueAs: (value: string) =>
              value === "" ? null : Number(value),
          })}
        />
      </div>

      <Textarea
        label="Дополнительная информация"
        placeholder="Введите дополнительную информацию"
        {...register("type1Diabetes.diagnosisDetails")}
        rows={3}
      />

      {/* Классические симптомы при дебюте */}

      <Field noteKey="type1Diabetes.classicSymptoms">
        <fieldset
          className={`${styles.fieldset} ${styles.compactSymptomsFieldset}`}
        >
          <legend>Классические симптомы при дебюте</legend>

          <div className={styles.compactSymptomsGrid}>
            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.classicSymptoms.polyuria")}
              />
              <span>Полиурия</span>
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.classicSymptoms.polydipsia")}
              />
              <span>Полидипсия</span>
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.classicSymptoms.weakness")}
              />
              <span>Слабость</span>
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.classicSymptoms.weightLoss")}
              />
              <span>Снижение веса</span>
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.classicSymptoms.nausea")}
              />
              <span>Тошнота</span>
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.classicSymptoms.vomiting")}
              />
              <span>Рвота</span>
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.classicSymptoms.abdominalPain")}
              />
              <span>Боли в животе</span>
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.classicSymptoms.visionBlur")}
              />
              <span>Помутнение зрения</span>
            </label>

            <label>
              <input
                type="checkbox"
                {...register(
                  "type1Diabetes.classicSymptoms.lossOfConsciousness",
                )}
              />
              <span>Потеря сознания</span>
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.classicSymptoms.other")}
              />
              <span>Свой вариант</span>
            </label>
          </div>

          {otherClassicSymptom && (
            <div className={styles.compactSymptomsOther}>
              <Textarea
                label="Свой вариант"
                placeholder="Укажите другой симптом"
                {...register("type1Diabetes.classicSymptoms.otherDetails")}
                rows={2}
              />
            </div>
          )}
        </fieldset>
      </Field>

      <YesNo
        label="Первично поставлен СД 2 типа?"
        name="type1Diabetes.initiallyType2"
        register={register}
      />

      {/* Островковые аутоантитела */}

      <fieldset className={styles.fieldset}>
        <legend>Островковые аутоантитела</legend>

        <Controller
          name="type1Diabetes.autoantibodies.tested"
          control={control}
          render={({ field }) => (
            <ToggleSwitch
              ref={field.ref}
              name={field.name}
              label="Исследовались ли островковые аутоантитела?"
              checked={boolFromString(field.value) === true}
              onChange={(checked) => field.onChange(checked)}
              onBlur={field.onBlur}
              onLabel="Да"
              offLabel="Нет"
            />
          )}
        />

        {autoantibodiesTested === true && (
          <>
            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.autoantibodies.GAD")}
              />{" "}
              GAD
            </label>

            {gadChecked && (
              <Input
                label="GAD"
                type="number"
                step="0.1"
                suffix="Ед/мл"
                {...register("type1Diabetes.autoantibodies.GADValue")}
              />
            )}

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.autoantibodies.IA2")}
              />{" "}
              IA-2
            </label>

            {ia2Checked && (
              <Input
                label="IA-2"
                type="number"
                step="0.1"
                suffix="Ед/мл"
                {...register("type1Diabetes.autoantibodies.IA2Value")}
              />
            )}

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.autoantibodies.ZnT8")}
              />{" "}
              ZnT8
            </label>

            {znt8Checked && (
              <Input
                label="ZnT8"
                type="number"
                step="0.1"
                suffix="Ед/мл"
                {...register("type1Diabetes.autoantibodies.ZnT8Value")}
              />
            )}

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.autoantibodies.IAA")}
              />{" "}
              IAA
            </label>

            {iaaChecked && (
              <Input
                label="IAA"
                type="number"
                step="0.1"
                suffix="Ед/мл"
                {...register("type1Diabetes.autoantibodies.IAAValue")}
              />
            )}

            <Field noteKey="type1Diabetes.autoantibodies">
              <div />
            </Field>
          </>
        )}
      </fieldset>

      {/* C-пептид */}

      <Field noteKey="type1Diabetes.cPeptide">
        <fieldset className={styles.fieldset}>
          <legend>C-пептид</legend>

          <Controller
            name="type1Diabetes.cPeptide.tested"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                ref={field.ref}
                name={field.name}
                label="Определялся C-пептид?"
                checked={boolFromString(field.value) === true}
                onChange={(checked) => field.onChange(checked)}
                onBlur={field.onBlur}
                onLabel="Да"
                offLabel="Нет"
              />
            )}
          />

          {cPeptideTested === true && (
            <>
              <Input
                label="Значение"
                suffix="нг/мл"
                {...register("type1Diabetes.cPeptide.value")}
              />

              <DateField
                label="Дата"
                name="type1Diabetes.cPeptide.date"
                watch={watch}
                setValue={setValue}
                disabled={cPeptideUnknown}
              />

              <label className={styles.smallCheckbox}>
                <input
                  type="checkbox"
                  {...register("type1Diabetes.cPeptide.unknown")}
                />{" "}
                Затрудняюсь ответить
              </label>
            </>
          )}
        </fieldset>
      </Field>

      {/* Гликированный гемоглобин */}

      <Field noteKey="type1Diabetes.hba1c">
        <fieldset className={styles.fieldset}>
          <legend>Гликированный гемоглобин</legend>

          <Controller
            name="type1Diabetes.hba1c.tested"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                ref={field.ref}
                name={field.name}
                label="Определялся гликированный гемоглобин?"
                checked={boolFromString(field.value) === true}
                onChange={(checked) => field.onChange(checked)}
                onBlur={field.onBlur}
                onLabel="Да"
                offLabel="Нет"
              />
            )}
          />

          {hba1cTestedType1 === true && (
            <>
              <Input
                label="Значение"
                type="number"
                step="0.1"
                suffix="%"
                {...register("type1Diabetes.hba1c.value")}
              />

              <DateField
                label="Дата"
                name="type1Diabetes.hba1c.date"
                watch={watch}
                setValue={setValue}
              />

              <label className={styles.smallCheckbox}>
                <input
                  type="checkbox"
                  {...register("type1Diabetes.hba1c.unknown")}
                />{" "}
                Затрудняюсь ответить
              </label>
            </>
          )}
        </fieldset>
      </Field>

      {/* Гестационный сахарный диабет */}

      <GestationalDiabetesSection diabetesPath="type1Diabetes" />

      {/* Наследственность по сахарному диабету */}

      <YesNo
        label="Наследственность по сахарному диабету"
        name="type1Diabetes.familyHistoryDiabetes"
        register={register}
      />

      {familyHistoryDiabetes === true && (
        <>
          <FamilyHistoryTree />

          <Textarea
            label="Уточните наследственность"
            placeholder="Дополнительная информация о родственниках"
            {...register("type1Diabetes.familyHistoryDiabetesDetails")}
            rows={3}
          />
        </>
      )}
    </div>
  );
};
