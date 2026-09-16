import React from "react";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Field } from "../Field";
import { YesNo } from "../YesNo";
import { DrugList } from "../DrugList";
import type { TabProps } from "./types";
import styles from "../styles.module.scss";
import { boolFromString } from "@/shared/lib/boolFromString.ts";

export const TherapyTab: React.FC<TabProps> = ({
  register,
  watch,
  control,
}) => {
  const isType1 = watch("primaryExam.suspectedDiagnosis") === "type1";
  const isType2 = watch("primaryExam.suspectedDiagnosis") === "type2";
  const type1Data = watch("type1Diabetes");
  const type2Data = watch("type2Diabetes");

  // Нормализуем watch-значения
  const type1DiabetesOtherDrugsTaken = boolFromString(
    watch("type1Diabetes.initialTherapy.otherDrugsTaken"),
  );
  const sameAsInitial = boolFromString(watch("actualTherapy.sameAsInitial"));
  const missedSideEffects =
    watch("type2Diabetes.missedReasons.sideEffects") === true;
  const missedOther = watch("type2Diabetes.missedReasons.other") === true;

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
        <fieldset className={styles.fieldset}>
          <legend>Терапия в дебюте</legend>

          <div className={styles.radioGroup}>
            <label>Способ введения инсулина:</label>
            <label>
              <input
                type="radio"
                value="injections"
                {...register("type1Diabetes.initialTherapy.injectionMethod")}
              />{" "}
              Многократные инъекции
            </label>
            <label>
              <input
                type="radio"
                value="pump"
                {...register("type1Diabetes.initialTherapy.injectionMethod")}
              />{" "}
              Инсулиновая помпа
            </label>
          </div>

          {watch("type1Diabetes.initialTherapy.injectionMethod") ===
            "injections" && (
            <div className={styles.radioGroup}>
              <label>Устройство:</label>
              <label>
                <input
                  type="radio"
                  value="syringe"
                  {...register("type1Diabetes.initialTherapy.injectionsDevice")}
                />{" "}
                Шприц
              </label>
              <label>
                <input
                  type="radio"
                  value="pen"
                  {...register("type1Diabetes.initialTherapy.injectionsDevice")}
                />{" "}
                Ручка
              </label>
            </div>
          )}

          {watch("type1Diabetes.initialTherapy.injectionMethod") === "pump" && (
            <Input
              label="Модель помпы"
              {...register("type1Diabetes.initialTherapy.pumpModel")}
            />
          )}

          <fieldset className={styles.fieldset}>
            <legend>Базальный инсулин</legend>
            <DrugList
              control={control}
              register={register}
              name="type1Diabetes.initialTherapy.basalInsulin"
              firstField="drugName"
              nameLabel="Название препарата"
            />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Болюсный инсулин</legend>
            <DrugList
              control={control}
              register={register}
              name="type1Diabetes.initialTherapy.bolusInsulin"
              firstField="drugName"
              nameLabel="Название препарата"
            />
          </fieldset>

          <YesNo
            label="Другие сахаропонижающие препараты"
            name="type1Diabetes.initialTherapy.otherDrugsTaken"
            register={register}
          />
          {type1DiabetesOtherDrugsTaken === true && (
            <Textarea
              label="Какие препараты"
              {...register("type1Diabetes.initialTherapy.otherDrugs")}
              rows={2}
            />
          )}

          <Input
            label="Привычные цифры глюкозы на терапии"
            type="number"
            step="0.1"
            suffix="ммоль/л"
            {...register("type1Diabetes.initialTherapy.usualGlucoseOnTherapy")}
          />
        </fieldset>
      )}

      {/* ===== Терапия в дебюте — СД 2 типа ===== */}
      {isType2 && type2Data && (
        <Field noteKey="type2Diabetes.initialTherapy">
          <fieldset className={styles.fieldset}>
            <legend>Терапия в дебюте</legend>
            <DrugList
              control={control}
              register={register}
              name="type2Diabetes.initialTherapy"
              firstField="drugName"
              nameLabel="Название препарата"
              showFrequency
            />
          </fieldset>
        </Field>
      )}

      {/* ===== Актуальная терапия ===== */}
      <fieldset className={styles.fieldset}>
        <legend>Актуальная терапия</legend>

        <YesNo
          label="Совпадает с терапией в дебюте?"
          name="actualTherapy.sameAsInitial"
          register={register}
        />

        {sameAsInitial === false && (
          <>
            <Textarea
              label="Причина коррекции терапии"
              {...register("actualTherapy.correctionReason")}
              rows={2}
            />
            <Textarea
              label="Скорректированная терапия"
              {...register("actualTherapy.correctedTherapy")}
              rows={2}
            />
          </>
        )}
      </fieldset>

      {/* ===== Состояние мест инъекций (только СД 1) ===== */}
      {isType1 && type1Data && (
        <Field noteKey="type1Diabetes.injectionSitesInfo">
          <fieldset className={styles.fieldset}>
            <legend>Место инъекций</legend>

            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.injectionSitesInfo.sites.abdomen")}
              />{" "}
              Живот (околопупочная область)
            </label>
            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.injectionSitesInfo.sites.thighs")}
              />{" "}
              Наружная поверхность бедер
            </label>
            <label>
              <input
                type="checkbox"
                {...register("type1Diabetes.injectionSitesInfo.sites.buttocks")}
              />{" "}
              Верхний наружный квадрант ягодиц
            </label>
            <label>
              <input
                type="checkbox"
                {...register(
                  "type1Diabetes.injectionSitesInfo.sites.shoulders",
                )}
              />{" "}
              Наружная поверхность плеч
            </label>

            <Input
              label="Частота смены места инъекции"
              {...register(
                "type1Diabetes.injectionSitesInfo.siteChangeFrequency",
              )}
            />
            <Input
              label="Частота смены игл"
              {...register(
                "type1Diabetes.injectionSitesInfo.needleChangeFrequency",
              )}
            />

            <fieldset className={styles.fieldset}>
              <legend>Липодистрофии</legend>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "type1Diabetes.injectionSitesInfo.lipodystrophy.none",
                  )}
                />{" "}
                Отсутствуют
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "type1Diabetes.injectionSitesInfo.lipodystrophy.lipohypertrophy",
                  )}
                />{" "}
                Липогипертрофии
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "type1Diabetes.injectionSitesInfo.lipodystrophy.lipoatrophy",
                  )}
                />{" "}
                Липоатрофии
              </label>
            </fieldset>

            <YesNo
              label="Болезненность при пальпации"
              name="type1Diabetes.injectionSitesInfo.tenderness"
              register={register}
            />

            <div className={styles.radioGroup}>
              <label>Температура кожи:</label>
              <label>
                <input
                  type="radio"
                  value="normal"
                  {...register(
                    "type1Diabetes.injectionSitesInfo.skinTemperature",
                  )}
                />{" "}
                Нормальная
              </label>
              <label>
                <input
                  type="radio"
                  value="hyperthermia"
                  {...register(
                    "type1Diabetes.injectionSitesInfo.skinTemperature",
                  )}
                />{" "}
                Гипертермия
              </label>
            </div>

            <div className={styles.radioGroup}>
              <label>Инфильтраты:</label>
              <label>
                <input
                  type="radio"
                  value="none"
                  {...register("type1Diabetes.injectionSitesInfo.infiltrates")}
                />{" "}
                Отсутствуют
              </label>
              <label>
                <input
                  type="radio"
                  value="present"
                  {...register("type1Diabetes.injectionSitesInfo.infiltrates")}
                />{" "}
                Присутствуют
              </label>
            </div>
          </fieldset>
        </Field>
      )}

      {/* ===== Приверженность терапии (только СД 2) ===== */}
      {isType2 && (
        <>
          <YesNo
            label="Приверженность приёма терапии?"
            name="type2Diabetes.therapyRegularity"
            register={register}
          />

          <Input
            label="Сколько раз в неделю можете пропустить приём таблеток?"
            type="number"
            {...register("type2Diabetes.missedDosesPerWeek")}
          />

          <fieldset className={styles.fieldset}>
            <legend>Что мешает принимать регулярно?</legend>

            <label>
              <input
                type="checkbox"
                {...register("type2Diabetes.missedReasons.sideEffects")}
              />{" "}
              Побочные эффекты
            </label>
            {missedSideEffects && (
              <Input
                label="Какие побочные эффекты?"
                {...register("type2Diabetes.missedReasons.sideEffectsDetails")}
              />
            )}

            <label>
              <input
                type="checkbox"
                {...register("type2Diabetes.missedReasons.cost")}
              />{" "}
              Стоимость
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type2Diabetes.missedReasons.complexity")}
              />{" "}
              Сложность схемы
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type2Diabetes.missedReasons.forgetfulness")}
              />{" "}
              Забывчивость
            </label>

            <label>
              <input
                type="checkbox"
                {...register("type2Diabetes.missedReasons.other")}
              />{" "}
              Другое
            </label>
            {missedOther && (
              <Input
                label="Уточните"
                {...register("type2Diabetes.missedReasons.otherDetails")}
              />
            )}
          </fieldset>
        </>
      )}
    </div>
  );
};
