import React, { useEffect, useRef, useState } from "react";

import { useFormContext } from "react-hook-form";

import {
  GRAVES_SYMPTOMS,
  type AnamnesisFormData,
  type GravesSymptomKey,
} from "@/entities/anamnesis";

import { DateField } from "@/shared/ui/DateInput";

import { createGravesDiseaseDefaults } from "../../../lib/gravesDefaults";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

const SYMPTOM_LABELS: Record<GravesSymptomKey, string> = Object.fromEntries(
  GRAVES_SYMPTOMS.map(({ key, label }) => [key, label]),
) as Record<GravesSymptomKey, string>;

const isGravesSymptom = (value: string): value is GravesSymptomKey =>
  GRAVES_SYMPTOMS.some((item) => item.key === value);

export const GravesDiseaseSection: React.FC = () => {
  const { getValues, watch, setValue, register } =
    useFormContext<AnamnesisFormData>();

  const selected = watch("gravesDisease.clinicalManifestations") ?? [];
  const visitedEndocrinologist = watch("gravesDisease.visitedEndocrinologist");

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
      setValue("gravesDisease", defaults, { shouldDirty: false });
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
        { ...defaults, ...current, clinicalManifestations: symptoms },
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
    event: React.DragEvent<HTMLLIElement>,
    key: GravesSymptomKey,
  ) => {
    dragSourceRef.current = key;
    setDragging(key);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", key);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLIElement>,
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

  return (
    <section className={`${styles.section} ${styles.gravesSection}`}>
      <h3>Болезнь Грейвса</h3>

      <div className={styles.gravesDateField}>
        <DateField
          label="Дата появления первых симптомов"
          name="gravesDisease.firstSymptomsDate"
          watch={watch}
          setValue={setValue}
          placeholder="дд.мм.гггг"
        />
      </div>

      <fieldset className={styles.fieldset}>
        <legend>Клинические проявления</legend>

        <div className={styles.gravesSymptomGrid}>
          {GRAVES_SYMPTOMS.map(({ key, label }) => {
            const checked = selected.includes(key);

            return (
              <label
                key={key}
                className={`${styles.gravesSymptomOption} ${
                  checked ? styles.gravesSymptomOptionSelected : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => toggleSymptom(key, event.target.checked)}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {selected.length > 0 && (
        <div className={styles.gravesOrderedSection}>
          <div className={styles.gravesOrderedTitle}>
            Порядок выбранных проявлений
          </div>
          <p className={styles.gravesOrderedHint}>
            Перетащите строку или используйте стрелки для изменения порядка.
          </p>

          <ol className={styles.gravesOrderedList}>
            {selected.map((key, index) => (
              <li
                key={key}
                draggable
                onDragStart={(event) => handleDragStart(event, key)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, index)}
                onDragEnd={() => {
                  dragSourceRef.current = null;
                  setDragging(null);
                }}
                className={`${styles.gravesOrderedItem} ${
                  dragging === key ? styles.gravesDragging : ""
                }`}
              >
                <span className={styles.gravesDragHandle} aria-hidden="true">
                  ⋮⋮
                </span>
                <span className={styles.gravesOrderLabel}>
                  {index + 1}. {SYMPTOM_LABELS[key]}
                </span>
                <div className={styles.gravesOrderButtons}>
                  <button
                    type="button"
                    className={styles.gravesOrderButton}
                    disabled={index === 0}
                    onClick={() => moveSymptom(key, index - 1)}
                    aria-label={`Переместить «${SYMPTOM_LABELS[key]}» выше`}
                    title="Переместить выше"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={styles.gravesOrderButton}
                    disabled={index === selected.length - 1}
                    onClick={() => moveSymptom(key, index + 1)}
                    aria-label={`Переместить «${SYMPTOM_LABELS[key]}» ниже`}
                    title="Переместить ниже"
                  >
                    ↓
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

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
