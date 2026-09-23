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

export const Type2DiabetesSection: React.FC = () => {
  const { register, watch, setValue } = useFormContext<AnamnesisFormData>();

  const hba1cTestedType2 = boolFromString(watch("type2Diabetes.hba1c.tested"));

  const hba1cUnknownType2 = watch("type2Diabetes.hba1c.unknown") === true;

  const otherClassicSymptom =
    watch("type2Diabetes.classicSymptoms.other") === true;

  const familyHistoryDiabetes = boolFromString(
    watch("type2Diabetes.familyHistoryDiabetes"),
  );

  return (
    <div className={styles.section}>
      <h3>Дебют СД 2 типа</h3>

      <Input
        label="Когда впервые замечено повышение глюкозы? (год)"
        {...register("type2Diabetes.firstGlucoseElevationYear")}
      />

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

      <Textarea
        label="Дополнительная информация"
        placeholder="Введите дополнительную информацию"
        {...register("type2Diabetes.diagnosisDetails")}
        rows={3}
      />

      <fieldset className={styles.fieldset}>
        <legend>Симптомы при дебюте</legend>

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
            {...register("type2Diabetes.classicSymptoms.polydipsia")}
          />{" "}
          Полидипсия
        </label>

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
            {...register("type2Diabetes.classicSymptoms.weightLoss")}
          />{" "}
          Снижение веса
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
            {...register("type2Diabetes.classicSymptoms.other")}
          />{" "}
          Свой вариант ответа
        </label>

        {otherClassicSymptom && (
          <Textarea
            label="Свой вариант"
            placeholder="Укажите другой симптом"
            {...register("type2Diabetes.classicSymptoms.otherDetails")}
            rows={2}
          />
        )}
      </fieldset>

      <Field noteKey="type2Diabetes.maxGlucoseValues">
        <Textarea
          label="Максимально зафиксированные значения глюкозы"
          {...register("type2Diabetes.maxGlucoseValues")}
          rows={2}
        />
      </Field>

      <fieldset className={styles.fieldset}>
        <legend>Гликированный гемоглобин</legend>

        <YesNo
          label="Определялся гликированный гемоглобин?"
          name="type2Diabetes.hba1c.tested"
          register={register}
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

      <YesNo
        label="Женщинам: гестационный сахарный диабет (во время беременности были повышены сахара)?"
        name="type2Diabetes.gestationalDiabetes"
        register={register}
      />

      <YesNo
        label="Наследственность по сахарному диабету"
        name="type2Diabetes.familyHistoryDiabetes"
        register={register}
      />

      {familyHistoryDiabetes === true && (
        <Textarea
          label="Уточните наследственность"
          placeholder="Например: мать — СД 2 типа, бабушка — сахарный диабет"
          {...register("type2Diabetes.familyHistoryDiabetesDetails")}
          rows={3}
        />
      )}
    </div>
  );
};
