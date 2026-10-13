import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

type DiabetesPath = "type1Diabetes" | "type2Diabetes";

interface GestationalDiabetesSectionProps {
  diabetesPath: DiabetesPath;
}

/**
 * Преобразуем пустое числовое поле в null, а не в NaN.
 * Это позволяет корректно сохранять необязательные числа.
 */
const toNullableNumber = (value: unknown): number | null => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
};

/**
 * Общий блок для анамнеза СД 1 и СД 2 типа.
 * Сохраняем прежний путь type2Diabetes.gestationalDiabetes,
 * чтобы существующие ответы продолжали читаться.
 */
export const GestationalDiabetesSection: React.FC<
  GestationalDiabetesSectionProps
> = ({ diabetesPath }) => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const gender = watch("gender");

  const gestationalDiabetes = boolFromString(
    watch(`${diabetesPath}.gestationalDiabetes`),
  );

  const detailsPath = `${diabetesPath}.gestationalDiabetesDetails` as const;

  const newbornWeight = watch(`${detailsPath}.newbornWeight`);

  if (gender !== "female") {
    return null;
  }

  return (
    <div className={styles.gestationalDiabetesSection}>
      <YesNo
        label="Женщинам: гестационный сахарный диабет?"
        name={`${diabetesPath}.gestationalDiabetes`}
        register={register}
      />

      {gestationalDiabetes === true && (
        <div className={styles.gestationalDiabetesDetails}>
          <fieldset className={styles.fieldset}>
            <legend>Беременность</legend>

            <label>
              <input
                type="radio"
                value="singleton"
                {...register(`${detailsPath}.pregnancyType`)}
              />{" "}
              Одноплодная
            </label>

            <label>
              <input
                type="radio"
                value="multiple"
                {...register(`${detailsPath}.pregnancyType`)}
              />{" "}
              Многоплодная
            </label>
          </fieldset>

          <Input
            label="На каком сроке выявлен ГСД?"
            type="number"
            min={1}
            max={45}
            step={1}
            suffix="недель"
            {...register(`${detailsPath}.diagnosisWeek`, {
              setValueAs: toNullableNumber,
            })}
          />

          <Input
            label="Цифровое значение гликемии"
            type="number"
            min={0}
            max={50}
            step="0.1"
            suffix="ммоль/л"
            {...register(`${detailsPath}.glycemiaAtDiagnosis`, {
              setValueAs: toNullableNumber,
            })}
          />

          <Textarea
            label="Дополнительная информация"
            placeholder="Уточнения по выявлению ГСД"
            rows={2}
            {...register(`${detailsPath}.diagnosisAdditionalInfo`)}
          />

          <fieldset className={styles.fieldset}>
            <legend>Клинические проявления (можно выбрать несколько)</legend>

            <div className={styles.gestationalDiabetesSymptoms}>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    `${detailsPath}.clinicalManifestations.weakness`,
                  )}
                />
                Слабость
              </label>

              <label>
                <input
                  type="checkbox"
                  {...register(
                    `${detailsPath}.clinicalManifestations.painfulItchyUrination`,
                  )}
                />
                Зуд и болезненность при мочеиспускании
              </label>

              <label>
                <input
                  type="checkbox"
                  {...register(
                    `${detailsPath}.clinicalManifestations.skinItching`,
                  )}
                />
                Зуд кожи
              </label>

              <label>
                <input
                  type="checkbox"
                  {...register(
                    `${detailsPath}.clinicalManifestations.polyuria`,
                  )}
                />
                Полиурия
              </label>

              <label>
                <input
                  type="checkbox"
                  {...register(
                    `${detailsPath}.clinicalManifestations.polydipsia`,
                  )}
                />
                Полидипсия
              </label>

              <label>
                <input
                  type="checkbox"
                  {...register(`${detailsPath}.clinicalManifestations.hunger`)}
                />
                Голод
              </label>
            </div>

            <Textarea
              label="Другие клинические проявления"
              placeholder="Укажите другие симптомы"
              rows={2}
              {...register(`${detailsPath}.clinicalManifestationsOther`)}
            />
          </fieldset>

          <Textarea
            label="Проводимая терапия"
            placeholder="Какая терапия проводилась?"
            rows={2}
            {...register(`${detailsPath}.therapy`)}
          />

          <YesNo
            label="Многоводие"
            name={`${detailsPath}.polyhydramnios`}
            register={register}
          />

          <Input
            label="Масса ребёнка при рождении"
            type="number"
            min={1}
            max={10000}
            step={1}
            suffix="г"
            {...register(`${detailsPath}.newbornWeight`, {
              setValueAs: toNullableNumber,
            })}
          />

          {newbornWeight !== null &&
            newbornWeight !== undefined &&
            Number(newbornWeight) > 3800 && (
              <p
                className={styles.gestationalDiabetesMacrosomiaHint}
                role="status"
              >
                Макросомия
              </p>
            )}

          <Textarea
            label="Патологии ребёнка"
            placeholder="Укажите патологии, если они были"
            rows={2}
            {...register(`${detailsPath}.childPathologies`)}
          />

          <YesNo
            label="Макросомия"
            name={`${detailsPath}.macrosomia`}
            register={register}
          />

          <Input
            label="Неделя родов"
            type="number"
            min={1}
            max={45}
            step={1}
            suffix="недель"
            {...register(`${detailsPath}.deliveryWeek`, {
              setValueAs: toNullableNumber,
            })}
          />

          <YesNo
            label="Нормализация показателей глюкозы после родов"
            name={`${detailsPath}.postpartumGlucoseNormalized`}
            register={register}
          />

          <Textarea
            label="Дополнительная информация"
            placeholder="Дополнительные сведения о течении беременности и родах"
            rows={2}
            {...register(`${detailsPath}.additionalInfo`)}
          />
        </div>
      )}
    </div>
  );
};
