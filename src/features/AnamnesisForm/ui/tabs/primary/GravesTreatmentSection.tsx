import React, { useEffect } from "react";

import { Controller, useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { DateField } from "@/shared/ui/DateInput";
import { Input } from "@/shared/ui/Input";
import { ToggleSwitch } from "@/shared/ui/ToggleSwitch";

import { createGravesDiseaseDefaults } from "../../../lib/gravesDefaults";

import { DrugList } from "../../DrugList";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";
import localStyles from "./GravesTreatmentSection.module.scss";

type LabKey = "tsh" | "freeT4" | "freeT3";

const LAB_TESTS: { key: LabKey; label: string; unit: string }[] = [
  { key: "tsh", label: "ТТГ", unit: "мкМЕ/л" },
  { key: "freeT4", label: "Т4св", unit: "пмоль/л" },
  { key: "freeT3", label: "Т3св", unit: "пкмоль/л" },
];

export const GravesTreatmentSection: React.FC = () => {
  const { control, register, watch, setValue, getValues } =
    useFormContext<AnamnesisFormData>();

  const therapy = watch("gravesDisease.therapy");
  const laboratory = watch("gravesDisease.laboratory");
  const correction = boolFromString(watch("gravesDisease.therapy.correction"));
  const antibodiesEnabled = boolFromString(
    watch("gravesDisease.laboratory.antibodiesEnabled"),
  );

  // Для старых черновиков, открытых до нормализации, добавляем только
  // отсутствующие части. Значения уже заполненных полей не трогаем.
  useEffect(() => {
    const current = getValues("gravesDisease");
    if (!current) return;

    const defaults = createGravesDiseaseDefaults();

    if (!current.therapy || !Array.isArray(current.therapy.medications)) {
      setValue(
        "gravesDisease.therapy",
        {
          ...defaults.therapy,
          ...current.therapy,
          medications: Array.isArray(current.therapy?.medications)
            ? current.therapy.medications
            : defaults.therapy.medications,
        },
        { shouldDirty: false },
      );
    }

    if (
      !current.laboratory ||
      !current.laboratory.tsh ||
      !current.laboratory.freeT4 ||
      !current.laboratory.freeT3
    ) {
      setValue(
        "gravesDisease.laboratory",
        {
          ...defaults.laboratory,
          ...current.laboratory,
          tsh: {
            ...defaults.laboratory.tsh,
            ...current.laboratory?.tsh,
          },
          freeT4: {
            ...defaults.laboratory.freeT4,
            ...current.laboratory?.freeT4,
          },
          freeT3: {
            ...defaults.laboratory.freeT3,
            ...current.laboratory?.freeT3,
          },
        },
        { shouldDirty: false },
      );
    }
  }, [getValues, setValue]);

  if (!therapy || !laboratory || !Array.isArray(therapy.medications)) {
    return null;
  }

  return (
    <section className={`${styles.section} ${styles.therapySection}`}>
      <h3>Терапия</h3>

      <DrugList
        control={control}
        register={register}
        name="gravesDisease.therapy.medications"
        firstField="drugName"
        showFrequency
      />

      <div className={localStyles.questionGroup}>
        <YesNo
          label="Коррекция терапии?"
          name="gravesDisease.therapy.correction"
          register={register}
        />

        {correction === true && (
          <div className={localStyles.correctionFields}>
            <div className={localStyles.shortField}>
              <Input
                label="Причина коррекции терапии"
                {...register("gravesDisease.therapy.correctionReason")}
              />
            </div>
            <div className={localStyles.shortField}>
              <Input
                label="Скорректированная терапия"
                {...register("gravesDisease.therapy.correctedTherapy")}
              />
            </div>
          </div>
        )}

        <YesNo
          label="Самостоятельное изменение дозировки?"
          name="gravesDisease.therapy.selfDoseChange"
          register={register}
        />

        <YesNo
          label="Самостоятельная отмена?"
          name="gravesDisease.therapy.selfDiscontinuation"
          register={register}
        />
      </div>

      <fieldset className={`${styles.fieldset} ${localStyles.laboratory}`}>
        <legend>Лабораторный контроль показателей</legend>

        {LAB_TESTS.map(({ key, label, unit }) => (
          <div key={key} className={localStyles.labRow}>
            <div className={localStyles.labValue}>
              <Input
                label={label}
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                {...register(`gravesDisease.laboratory.${key}.value`)}
              />
            </div>

            <span className={localStyles.labUnit}>{unit}</span>

            <div className={localStyles.labDate}>
              <DateField
                label="от"
                name={`gravesDisease.laboratory.${key}.date`}
                watch={watch}
                setValue={setValue}
                placeholder="дд.мм.гггг"
              />
            </div>
          </div>
        ))}

        <Controller
          name="gravesDisease.laboratory.antibodiesEnabled"
          control={control}
          render={({ field }) => (
            <ToggleSwitch
              ref={field.ref}
              name={field.name}
              label="Антитела"
              checked={boolFromString(field.value) === true}
              onChange={field.onChange}
              onBlur={field.onBlur}
              onLabel="Вкл"
              offLabel="Выкл"
            />
          )}
        />

        {antibodiesEnabled === true && (
          <div className={localStyles.antibodyList}>
            <label className={localStyles.antibodyRow}>
              <span>АТл к ТПО</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                {...register("gravesDisease.laboratory.antiTPO")}
              />
              <span>МЕ/мл</span>
            </label>

            <label className={localStyles.antibodyRow}>
              <span>АТл к ТГ</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                {...register("gravesDisease.laboratory.antiTG")}
              />
              <span>МЕ/мл</span>
            </label>
          </div>
        )}
      </fieldset>
    </section>
  );
};
