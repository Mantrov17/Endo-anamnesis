import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { DateField } from "@/shared/ui/DateInput";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../../Field";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const Type1DiabetesSection: React.FC = () => {
  const { register, watch, setValue } = useFormContext<AnamnesisFormData>();

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

      <Textarea
        label="Дополнительная информация"
        placeholder="Введите дополнительную информацию"
        {...register("type1Diabetes.diagnosisDetails")}
        rows={3}
      />

      <Field
        hint="Что послужило триггерным фактором?"
        noteKey="type1Diabetes.circumstances"
      >
        <Textarea
          label="Триггерный фактор"
          {...register("type1Diabetes.circumstances")}
          rows={2}
        />
      </Field>

      <Input
        label="Уровень гликемии в дебюте"
        type="number"
        step="0.1"
        suffix="ммоль/л"
        {...register("type1Diabetes.glycemiaAtOnset")}
      />

      <Field noteKey="type1Diabetes.classicSymptoms">
        <fieldset className={styles.fieldset}>
          <legend>Классические симптомы при дебюте</legend>

          <label>
            <input
              type="checkbox"
              {...register("type1Diabetes.classicSymptoms.polyuria")}
            />{" "}
            Полиурия
          </label>

          <label>
            <input
              type="checkbox"
              {...register("type1Diabetes.classicSymptoms.polydipsia")}
            />{" "}
            Полидипсия
          </label>

          <label>
            <input
              type="checkbox"
              {...register("type1Diabetes.classicSymptoms.weakness")}
            />{" "}
            Слабость
          </label>

          <label>
            <input
              type="checkbox"
              {...register("type1Diabetes.classicSymptoms.weightLoss")}
            />{" "}
            Снижение веса
          </label>

          <label>
            <input
              type="checkbox"
              {...register("type1Diabetes.classicSymptoms.nausea")}
            />{" "}
            Тошнота
          </label>

          <label>
            <input
              type="checkbox"
              {...register("type1Diabetes.classicSymptoms.vomiting")}
            />{" "}
            Рвота
          </label>

          <label>
            <input
              type="checkbox"
              {...register("type1Diabetes.classicSymptoms.abdominalPain")}
            />{" "}
            Боли в животе
          </label>

          <label>
            <input
              type="checkbox"
              {...register("type1Diabetes.classicSymptoms.visionBlur")}
            />{" "}
            Помутнение зрения
          </label>

          <label>
            <input
              type="checkbox"
              {...register("type1Diabetes.classicSymptoms.lossOfConsciousness")}
            />{" "}
            Потеря сознания
          </label>

          <label>
            <input
              type="checkbox"
              {...register("type1Diabetes.classicSymptoms.other")}
            />{" "}
            Свой вариант ответа
          </label>

          {otherClassicSymptom && (
            <Textarea
              label="Свой вариант"
              placeholder="Укажите другой симптом"
              {...register("type1Diabetes.classicSymptoms.otherDetails")}
              rows={2}
            />
          )}
        </fieldset>
      </Field>

      <YesNo
        label="Первично поставлен СД 2 типа?"
        name="type1Diabetes.initiallyType2"
        register={register}
      />

      <fieldset className={styles.fieldset}>
        <legend>Исследовались ли островковые аутоантитела?</legend>

        <YesNo
          label=""
          name="type1Diabetes.autoantibodies.tested"
          register={register}
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

      <Field noteKey="type1Diabetes.cPeptide">
        <fieldset className={styles.fieldset}>
          <legend>C-пептид</legend>

          <YesNo
            label="Определялся C-пептид?"
            name="type1Diabetes.cPeptide.tested"
            register={register}
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

      <Field noteKey="type1Diabetes.hba1c">
        <fieldset className={styles.fieldset}>
          <legend>Гликированный гемоглобин</legend>

          <YesNo
            label="Определялся гликированный гемоглобин?"
            name="type1Diabetes.hba1c.tested"
            register={register}
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

      <YesNo
        label="Наследственность по сахарному диабету"
        name="type1Diabetes.familyHistoryDiabetes"
        register={register}
      />

      {familyHistoryDiabetes === true && (
        <Textarea
          label="Уточните наследственность"
          placeholder="Например: мать — СД 2 типа, отец — СД 1 типа"
          {...register("type1Diabetes.familyHistoryDiabetesDetails")}
          rows={3}
        />
      )}
    </div>
  );
};
