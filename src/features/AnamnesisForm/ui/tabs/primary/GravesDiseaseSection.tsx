import React, { useEffect, useRef, useState } from "react";

import { useFormContext } from "react-hook-form";

import {
  GRAVES_SYMPTOMS,
  type AnamnesisFormData,
  type GravesSymptomKey,
} from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { DateField } from "@/shared/ui/DateInput";

import { createGravesDiseaseDefaults } from "../../../lib/gravesDefaults";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

const SYMPTOM_LABELS: Record<GravesSymptomKey, string> = Object.fromEntries(
  GRAVES_SYMPTOMS.map(({ key, label }) => [key, label]),
) as Record<GravesSymptomKey, string>;

const isGravesSymptom = (value: string): value is GravesSymptomKey =>
  GRAVES_SYMPTOMS.some((item) => item.key === value);

const pluralize = (count: number, forms: [string, string, string]): string => {
  const mod100 = count % 100;
  const mod10 = count % 10;

  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
};

const addMonthsClamped = (date: Date, months: number): Date => {
  const year = date.getFullYear();
  const month = date.getMonth() + months;
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  return new Date(year, month, Math.min(date.getDate(), lastDayOfMonth));
};

const calculateDiseaseDuration = (isoDate: string): string => {
  if (!isoDate) return "—";

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return "—";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const firstSymptomsDate = new Date(year, month - 1, day);

  if (
    firstSymptomsDate.getFullYear() !== year ||
    firstSymptomsDate.getMonth() !== month - 1 ||
    firstSymptomsDate.getDate() !== day
  ) {
    return "—";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (firstSymptomsDate > today) return "Дата в будущем";

  let totalMonths =
    (today.getFullYear() - year) * 12 + today.getMonth() - (month - 1);

  if (addMonthsClamped(firstSymptomsDate, totalMonths) > today) {
    totalMonths -= 1;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const anchor = addMonthsClamped(firstSymptomsDate, totalMonths);

  const days = Math.round(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(anchor.getFullYear(), anchor.getMonth(), anchor.getDate())) /
      86_400_000,
  );

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${pluralize(years, ["год", "года", "лет"])}`);
  }

  if (months > 0) {
    parts.push(
      `${months} ${pluralize(months, ["месяц", "месяца", "месяцев"])}`,
    );
  }

  if (days > 0 || parts.length === 0) {
    parts.push(`${days} ${pluralize(days, ["день", "дня", "дней"])}`);
  }

  return parts.join(" ");
};

export const GravesDiseaseSection: React.FC = () => {
  const { getValues, watch, setValue, register } =
    useFormContext<AnamnesisFormData>();

  const selected = watch("gravesDisease.clinicalManifestations") ?? [];

  const firstSymptomsDate = watch("gravesDisease.firstSymptomsDate") ?? "";

  // Нормализуем значение сразу при изменении радиокнопки.
  // Поддерживаются boolean, строковые значения и null.
  const visitedEndocrinologist = boolFromString(
    watch("gravesDisease.visitedEndocrinologist"),
  );

  const dragSourceRef = useRef<GravesSymptomKey | null>(null);
  const [dragging, setDragging] = useState<GravesSymptomKey | null>(null);

  /*
   * Инициализируем данные при первом выборе болезни Грейвса.
   * Не трогаем сохранённые сведения СД 1 / СД 2.
   * При повторном выборе болезни Грейвса сохраняем введённые ответы.
   */
  useEffect(() => {
    const current = getValues("gravesDisease");
    const defaults = createGravesDiseaseDefaults();

    if (!current) {
      setValue("gravesDisease", defaults, {
        shouldDirty: false,
      });
      return;
    }

    const symptoms = Array.isArray(current.clinicalManifestations)
      ? current.clinicalManifestations.filter(isGravesSymptom)
      : [];

    const needsNormalization =
      typeof current.firstSymptomsDate !== "string" ||
      !Array.isArray(current.clinicalManifestations) ||
      current.visitedEndocrinologist === undefined ||
      typeof current.endocrinologistVisitDate !== "string" ||
      typeof current.diagnosisDate !== "string";

    if (needsNormalization) {
      setValue(
        "gravesDisease",
        {
          ...defaults,
          ...current,
          clinicalManifestations: symptoms,
        },
        { shouldDirty: false },
      );
    }
  }, [getValues, setValue]);

  const updateSymptoms = (next: GravesSymptomKey[]) => {
    setValue("gravesDisease.clinicalManifestations", next, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const toggleSymptom = (key: GravesSymptomKey, checked: boolean) => {
    if (checked) {
      if (!selected.includes(key)) {
        updateSymptoms([...selected, key]);
      }
      return;
    }

    updateSymptoms(selected.filter((item) => item !== key));
  };

  const moveSymptom = (source: GravesSymptomKey, targetIndex: number) => {
    const current = getValues("gravesDisease.clinicalManifestations") ?? [];

    const sourceIndex = current.indexOf(source);

    if (
      sourceIndex === -1 ||
      targetIndex < 0 ||
      targetIndex >= current.length ||
      sourceIndex === targetIndex
    ) {
      return;
    }

    const next = [...current];
    next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, source);

    updateSymptoms(next);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    key: GravesSymptomKey,
  ) => {
    dragSourceRef.current = key;
    setDragging(key);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", key);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetIndex: number,
  ) => {
    event.preventDefault();

    const rawSource =
      dragSourceRef.current ?? event.dataTransfer.getData("text/plain");

    if (rawSource && isGravesSymptom(rawSource)) {
      moveSymptom(rawSource, targetIndex);
    }

    dragSourceRef.current = null;
    setDragging(null);
  };

  const symptomOrder = [
    ...selected.filter(isGravesSymptom),
    ...GRAVES_SYMPTOMS.map(({ key }) => key).filter(
      (key) => !selected.includes(key),
    ),
  ];

  return (
    <section className={`${styles.section} ${styles.gravesSection}`}>
      <h3>Болезнь Грейвса</h3>

      <div className={styles.gravesDateRow}>
        <div className={styles.gravesDateField}>
          <DateField
            label="Дата появления первых симптомов"
            name="gravesDisease.firstSymptomsDate"
            watch={watch}
            setValue={setValue}
            placeholder="дд.мм.гггг"
          />
        </div>

        <div className={styles.gravesDuration} aria-live="polite">
          <span className={styles.gravesDurationLabel}>
            Длительность заболевания
          </span>

          <strong className={styles.gravesDurationValue}>
            {calculateDiseaseDuration(firstSymptomsDate)}
          </strong>
        </div>
      </div>

      <fieldset className={styles.fieldset}>
        <legend>Клинические проявления</legend>

        <div className={styles.gravesSymptomGrid}>
          {symptomOrder.map((key) => {
            const checked = selected.includes(key);
            const selectedIndex = selected.indexOf(key);
            const label = SYMPTOM_LABELS[key];

            return (
              <div
                key={key}
                draggable={checked}
                onDragStart={
                  checked ? (event) => handleDragStart(event, key) : undefined
                }
                onDragOver={
                  checked ? (event) => event.preventDefault() : undefined
                }
                onDrop={
                  checked
                    ? (event) => handleDrop(event, selectedIndex)
                    : undefined
                }
                onDragEnd={() => {
                  dragSourceRef.current = null;
                  setDragging(null);
                }}
                className={`${styles.gravesSymptomOption} ${
                  checked ? styles.gravesSymptomOptionSelected : ""
                } ${dragging === key ? styles.gravesDragging : ""}`}
              >
                <label className={styles.gravesSymptomLabel}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) =>
                      toggleSymptom(key, event.target.checked)
                    }
                  />

                  {checked && (
                    <span className={styles.gravesSymptomIndex}>
                      {selectedIndex + 1}.
                    </span>
                  )}

                  <span className={styles.gravesSymptomText}>{label}</span>
                </label>

                {checked && (
                  <div className={styles.gravesOrderButtons}>
                    <button
                      type="button"
                      className={styles.gravesOrderButton}
                      disabled={selectedIndex === 0}
                      onClick={() => moveSymptom(key, selectedIndex - 1)}
                      aria-label={`Переместить «${label}» выше`}
                      title="Переместить выше"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      className={styles.gravesOrderButton}
                      disabled={selectedIndex === selected.length - 1}
                      onClick={() => moveSymptom(key, selectedIndex + 1)}
                      aria-label={`Переместить «${label}» ниже`}
                      title="Переместить ниже"
                    >
                      ↓
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>

      <YesNo
        label="Обращение к эндокринологу"
        name="gravesDisease.visitedEndocrinologist"
        yesNoLabels={["Было", "Не было"]}
        register={register}
      />

      {visitedEndocrinologist === true && (
        <>
          <div className={styles.gravesDateField}>
            <DateField
              label="Дата обращения к эндокринологу"
              name="gravesDisease.endocrinologistVisitDate"
              watch={watch}
              setValue={setValue}
              placeholder="дд.мм.гггг"
            />
          </div>

          <div className={styles.gravesDateField}>
            <DateField
              label="Дата постановки диагноза"
              name="gravesDisease.diagnosisDate"
              watch={watch}
              setValue={setValue}
              placeholder="дд.мм.гггг"
            />
          </div>
        </>
      )}
    </section>
  );
};
