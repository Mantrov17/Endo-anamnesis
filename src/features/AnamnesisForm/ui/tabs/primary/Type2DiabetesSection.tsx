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

export const Type2DiabetesSection: React.FC = () => {
  const { register, watch, setValue, control } =
    useFormContext<AnamnesisFormData>();

  const birthDate = watch("birthDate");

  const hba1cTestedType2 = boolFromString(watch("type2Diabetes.hba1c.tested"));

  const hba1cUnknownType2 = watch("type2Diabetes.hba1c.unknown") === true;

  const familyHistoryDiabetes = boolFromString(
    watch("type2Diabetes.familyHistoryDiabetes"),
  );

  return (
    <div className={styles.section}>
      <h3>Дебют СД 2 типа</h3>

      <div className={styles.row}>
        <Input
          label="Год постановки диагноза"
          type="text"
          inputMode="numeric"
          maxLength={4}
          placeholder="ГГГГ"
          {...register("type2Diabetes.yearOfDiagnosis")}
        />

        <Input
          label="Возраст постановки диагноза"
          type="number"
          suffix="лет"
          {...register("type2Diabetes.ageAtDiagnosis")}
        />

        <Input
          label="Длительность заболевания"
          type="number"
          suffix="лет"
          {...register("type2Diabetes.diseaseDuration")}
        />
      </div>

      {/* Целевой HbA1c перенесён из раздела «Терапия». */}

      <Input
        label="Целевой уровень гликированного гемоглобина"
        suffix="%"
        placeholder={birthDate ? undefined : "Укажите дату рождения пациента"}
        {...register("therapy.targetHba1c")}
        readOnly
        disabled={!birthDate}
      />

      {!birthDate && (
        <div className={styles.warning}>
          Целевой HbA1c не рассчитан, потому что дата рождения пациента не
          указана. Укажите дату рождения в карточке пациента.
        </div>
      )}

      <div className={styles.radioGroup}>
        <label>Как был поставлен диагноз?</label>

        <label>
          <input
            type="radio"
            value="accidental"
            {...register("type2Diabetes.howDiagnosed")}
          />{" "}
          Случайная находка
        </label>

        <label>
          <input
            type="radio"
            value="dispanserization"
            {...register("type2Diabetes.howDiagnosed")}
          />{" "}
          Диспансеризация
        </label>

        <label>
          <input
            type="radio"
            value="withComplaints"
            {...register("type2Diabetes.howDiagnosed")}
          />{" "}
          Приём с жалобами
        </label>

        <label>
          <input
            type="radio"
            value="hospitalization"
            {...register("type2Diabetes.howDiagnosed")}
          />{" "}
          Госпитализация
        </label>
      </div>

      <div className={styles.onsetGlycemiaField}>
        <Input
          label="Уровень гликемии в дебюте"
          type="number"
          inputMode="decimal"
          min={0}
          max={60}
          step="0.1"
          suffix="ммоль/л"
          {...register("type2Diabetes.glycemiaAtOnset", {
            setValueAs: (value: string) =>
              value === "" ? null : Number(value),
          })}
        />
      </div>

      <Textarea
        label="Дополнительная информация"
        placeholder="Введите дополнительную информацию"
        {...register("type2Diabetes.diagnosisDetails")}
        rows={3}
      />

      {/* Симптомы при дебюте СД 2 типа */}

      <fieldset className={styles.fieldset}>
        <legend>Симптомы при дебюте</legend>

        <label>
          <input
            type="checkbox"
            {...register("type2Diabetes.classicSymptoms.weakness")}
          />{" "}
          Слабость
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type2Diabetes.classicSymptoms.visionBlur")}
          />{" "}
          Нечёткость зрения
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type2Diabetes.classicSymptoms.skinItching")}
          />{" "}
          Кожный зуд
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type2Diabetes.classicSymptoms.polydipsia")}
          />{" "}
          Полидипсия
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type2Diabetes.classicSymptoms.polyuria")}
          />{" "}
          Полиурия
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type2Diabetes.classicSymptoms.urinaryInfection")}
          />{" "}
          Мочевая инфекция
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type2Diabetes.classicSymptoms.fingerParesthesia")}
          />{" "}
          Онемение/парестезии пальцев конечностей
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type2Diabetes.classicSymptoms.hunger")}
          />{" "}
          Чувство голода
        </label>

        <label>
          <input
            type="checkbox"
            {...register("type2Diabetes.classicSymptoms.weightLoss")}
          />{" "}
          Изменение массы тела
        </label>
      </fieldset>

      <Textarea
        label="Подробнее о клинических проявлениях"
        placeholder="Уточните симптомы и другие клинические проявления"
        {...register("type2Diabetes.classicSymptoms.otherDetails")}
        rows={3}
      />

      <Field noteKey="type2Diabetes.maxGlucoseValues">
        <Textarea
          label="Максимально зафиксированные значения глюкозы"
          {...register("type2Diabetes.maxGlucoseValues")}
          rows={2}
        />
      </Field>

      {/* Гликированный гемоглобин */}

      <fieldset className={styles.fieldset}>
        <legend>Гликированный гемоглобин</legend>

        <Controller
          name="type2Diabetes.hba1c.tested"
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

        {hba1cTestedType2 === true && (
          <>
            <Input
              label="Значение"
              type="number"
              step="0.1"
              suffix="%"
              {...register("type2Diabetes.hba1c.value")}
            />

            <DateField
              label="Дата"
              name="type2Diabetes.hba1c.date"
              watch={watch}
              setValue={setValue}
              disabled={hba1cUnknownType2}
            />

            <label className={styles.smallCheckbox}>
              <input
                type="checkbox"
                {...register("type2Diabetes.hba1c.unknown")}
              />{" "}
              Затрудняюсь ответить
            </label>
          </>
        )}
      </fieldset>

      <GestationalDiabetesSection diabetesPath="type2Diabetes" />

      {/* Наследственность по сахарному диабету */}

      <YesNo
        label="Наследственность по сахарному диабету"
        name="type2Diabetes.familyHistoryDiabetes"
        register={register}
      />

      {familyHistoryDiabetes === true && <FamilyHistoryTree />}
    </div>
  );
};
