import React, { useEffect, useRef, useState } from "react";

import {
  type Control,
  type FieldArrayPath,
  type Path,
  type UseFormRegister,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import styles from "./styles.module.scss";

export type DrugArrayPath =
  | "type1Diabetes.initialTherapy"
  | "type1Diabetes.initialTherapy.basalInsulin"
  | "type1Diabetes.initialTherapy.activeInsulin"
  | "type1Diabetes.initialTherapy.bolusInsulin"
  | "type2Diabetes.initialTherapy"
  | "therapy.currentDrugs"
  | "therapy.basalInsulin"
  | "therapy.prandialInsulin"
  | "actualTherapy.basalInsulin"
  | "actualTherapy.bolusInsulin"
  | "lifestyle.actualAntihypertensiveTherapy";

interface DrugListProps {
  control: Control<AnamnesisFormData>;

  register: UseFormRegister<AnamnesisFormData>;

  name: DrugArrayPath;

  firstField: "drugName" | "name";

  nameLabel?: string;

  doseSuffix?: string;

  showFrequency?: boolean;
}

const TIME_OPTIONS = [
  { key: "morning", icon: "🌅", label: "Утро" },
  { key: "day", icon: "☀️", label: "День" },
  { key: "evening", icon: "🌇", label: "Вечер" },
  { key: "night", icon: "🌙", label: "Ночь" },
] as const;

const createEmptyDrug = (firstField: "drugName" | "name") => ({
  [firstField]: "",
  tradeName: "",
  dose: "",
  frequency: "",
  frequencyPeriod: "day" as const,
  timesOfDay: {
    morning: false,
    day: false,
    evening: false,
    night: false,
  },
});

export const DrugList: React.FC<DrugListProps> = ({
  control,
  register,
  name,
  firstField,
  doseSuffix,
}) => {
  const { watch, setValue } = useFormContext<AnamnesisFormData>();

  const { fields, append, remove } = useFieldArray({
    control,

    name: name as FieldArrayPath<AnamnesisFormData>,
  });

  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);

  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (deleteTimer.current !== null) {
        clearTimeout(deleteTimer.current);
      }
    };
  }, []);

  const handleRemove = (id: string, index: number) => {
    if (deleteTimer.current !== null) {
      clearTimeout(deleteTimer.current);
      deleteTimer.current = null;
    }

    if (armedDeleteId === id) {
      remove(index);
      setArmedDeleteId(null);
      return;
    }

    setArmedDeleteId(id);
    deleteTimer.current = setTimeout(() => setArmedDeleteId(null), 1800);
  };

  const toggleTime = (
    index: number,
    key: (typeof TIME_OPTIONS)[number]["key"],
  ) => {
    const path =
      `${name}.${index}.timesOfDay.${key}` as Path<AnamnesisFormData>;

    const selected = watch(path) === true;

    setValue(path, !selected, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className={styles.drugList}>
      {fields.map((field, index) => {
        const firstPath =
          `${name}.${index}.${firstField}` as Path<AnamnesisFormData>;

        const tradeNamePath =
          `${name}.${index}.tradeName` as Path<AnamnesisFormData>;

        const dosePath = `${name}.${index}.dose` as Path<AnamnesisFormData>;

        const frequencyPath =
          `${name}.${index}.frequency` as Path<AnamnesisFormData>;

        const frequencyPeriodPath =
          `${name}.${index}.frequencyPeriod` as Path<AnamnesisFormData>;

        return (
          <div key={field.id} className={styles.drugRow}>
            <button
              type="button"
              className={`${styles.removeDrugButton} ${
                armedDeleteId === field.id ? styles.removeDrugButtonArmed : ""
              }`}
              onClick={() => handleRemove(field.id, index)}
              title={
                armedDeleteId === field.id
                  ? "Нажмите ещё раз для удаления"
                  : "Удалить препарат: нажмите дважды"
              }
              aria-label={
                armedDeleteId === field.id
                  ? "Подтвердить удаление препарата"
                  : "Удалить препарат двойным нажатием"
              }
            >
              ×
            </button>

            <div className={styles.drugNameGrid}>
              <Input
                label="МНН"
                placeholder="Международное название"
                {...register(firstPath)}
              />

              <Input
                label="Торговое название"
                placeholder="Название препарата"
                {...register(tradeNamePath)}
              />
            </div>

            <div className={styles.drugDetailsGrid}>
              <div className={styles.drugDoseField}>
                <Input
                  label="Доза"
                  suffix={doseSuffix}
                  {...register(dosePath)}
                />
              </div>

              <div className={styles.drugFrequencyField}>
                <label className={styles.drugFrequencyLabel}>Кратность</label>

                <div className={styles.drugFrequencyControls}>
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label="Количество приёмов"
                    placeholder="1"
                    {...register(frequencyPath)}
                  />

                  <select
                    aria-label="Период кратности приёма"
                    defaultValue="day"
                    {...register(frequencyPeriodPath)}
                  >
                    <option value="day">/день</option>
                    <option value="week">/неделю</option>
                    <option value="month">/месяц</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.drugTimeSection}>
              <span className={styles.drugTimeLabel}>Время приёма</span>

              <div className={styles.drugTimeButtons}>
                {TIME_OPTIONS.map((option) => {
                  const path =
                    `${name}.${index}.timesOfDay.${option.key}` as Path<AnamnesisFormData>;

                  const selected = watch(path) === true;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      className={`${styles.drugTimeButton} ${
                        selected ? styles.drugTimeButtonSelected : ""
                      }`}
                      onClick={() => toggleTime(index, option.key)}
                      title={option.label}
                      aria-label={`${option.label}: ${
                        selected ? "выбрано" : "не выбрано"
                      }`}
                      aria-pressed={selected}
                    >
                      <span aria-hidden="true">{option.icon}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        className={styles.addDrugButton}
        onClick={() => {
          setArmedDeleteId(null);
          append(createEmptyDrug(firstField) as never);
        }}
      >
        + Добавить препарат
      </button>
    </div>
  );
};
