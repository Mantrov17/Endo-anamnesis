import React, { useMemo } from "react";
import { Input } from "@/shared/ui/Input";
import { boolFromString } from "@/shared/lib/boolFromString";
import { Textarea } from "@/shared/ui/Textarea";
import { Field } from "../Field";
import { YesNo } from "../YesNo";
import { BMI_REFERENCE } from "../../lib/constants";
import type { TabProps } from "./types";
import styles from "../styles.module.scss";
import { DateField } from "@/shared/ui/DateInput";

export const PrimaryTab: React.FC<TabProps> = ({
  register,
  watch,
  setValue,
  errors,
}) => {
  const suspectedDiagnosis = watch("primaryExam.suspectedDiagnosis");
  const isType1 = suspectedDiagnosis === "type1";
  const isType2 = suspectedDiagnosis === "type2";
  const type1Data = watch("type1Diabetes");
  const type2Data = watch("type2Diabetes");

  const autoantibodiesTested = boolFromString(
    watch("type1Diabetes.autoantibodies.tested"),
  );
  const gadChecked = watch("type1Diabetes.autoantibodies.GAD");
  const ia2Checked = watch("type1Diabetes.autoantibodies.IA2");
  const znt8Checked = watch("type1Diabetes.autoantibodies.ZnT8");
  const iaaChecked = watch("type1Diabetes.autoantibodies.IAA");

  // Да/Нет для C-пептида и HbA1c (нормализуем строку в boolean)
  const cPeptideTested = boolFromString(watch("type1Diabetes.cPeptide.tested"));
  const cPeptideUnknown = watch("type1Diabetes.cPeptide.unknown") === true;
  const hba1cTestedType1 = boolFromString(watch("type1Diabetes.hba1c.tested"));
  const weightChange6Months = boolFromString(
    watch("primaryExam.weightChange6Months"),
  );

  const hba1cTestedType2 = boolFromString(watch("type2Diabetes.hba1c.tested"));
  const hba1cUnknownType2 = watch("type2Diabetes.hba1c.unknown") === true;

  const primaryBmi = watch("primaryExam.bmi");

  const bmiCategory = useMemo(() => {
    if (primaryBmi === null || primaryBmi === undefined || isNaN(primaryBmi)) {
      return null;
    }

    const v = Number(primaryBmi);

    if (v < 18) {
      return {
        label: "Дефицит массы тела",
        tone: "warn" as const,
      };
    }

    if (v < 25) {
      return {
        label: "Норма",
        tone: "ok" as const,
      };
    }

    if (v < 31) {
      return {
        label: "Избыточная масса тела",
        tone: "warn" as const,
      };
    }

    if (v < 36) {
      return {
        label: "Ожирение I степени",
        tone: "bad" as const,
      };
    }

    if (v < 41) {
      return {
        label: "Ожирение II степени",
        tone: "bad" as const,
      };
    }

    if (v < 46) {
      return {
        label: "Ожирение III степени",
        tone: "bad" as const,
      };
    }

    return {
      label: "Ожирение IV степени",
      tone: "bad" as const,
    };
  }, [primaryBmi]);

  return (
    <>
      <Field
        hint="Что вас к нам привело? С какими жалобами поступили?"
        noteKey="primaryExam.reason"
      >
        <Textarea
          label="Причина обращения"
          {...register("primaryExam.reason")}
          error={errors.primaryExam?.reason?.message}
          rows={3}
        />
      </Field>

      <fieldset className={styles.fieldset}>
        <legend>Антропометрия</legend>

        <div className={styles.row}>
          <Input
            label="Рост"
            type="number"
            suffix="см"
            {...register("primaryExam.height")}
          />

          <Input
            label="Вес"
            type="number"
            step="0.1"
            suffix="кг"
            {...register("primaryExam.weight")}
          />

          <Field hint={BMI_REFERENCE}>
            <Input
              label="ИМТ (авторасчёт)"
              type="number"
              step="0.1"
              suffix="кг/см²"
              {...register("primaryExam.bmi")}
              readOnly
            />
          </Field>
        </div>

        {bmiCategory && (
          <div className={`${styles.bmiBadge} ${styles[bmiCategory.tone]}`}>
            {bmiCategory.label}
          </div>
        )}

        <Input
          label="Окружность талии"
          type="number"
          suffix="см"
          {...register("primaryExam.waistCircumference")}
        />

        <Field noteKey="primaryExam.weightChangeReason">
          <YesNo
            label="Изменился ли вес за последние 6 месяцев?"
            name="primaryExam.weightChange6Months"
            register={register}
          />
        </Field>

        {weightChange6Months === true && (
          <>
            <div className={styles.row}>
              <Input
                label="Увеличился на"
                type="number"
                suffix="кг"
                {...register("primaryExam.weightIncreasedBy")}
              />

              <Input
                label="Уменьшился на"
                type="number"
                suffix="кг"
                {...register("primaryExam.weightDecreasedBy")}
              />
            </div>

            <div className={styles.radioGroup}>
              <label>Причина изменения веса:</label>

              <label>
                <input
                  type="radio"
                  value="unmotivated"
                  {...register("primaryExam.weightChangeReason")}
                />{" "}
                Немотивируемое
              </label>

              <label>
                <input
                  type="radio"
                  value="stress"
                  {...register("primaryExam.weightChangeReason")}
                />{" "}
                Стресс
              </label>

              <label>
                <input
                  type="radio"
                  value="diet"
                  {...register("primaryExam.weightChangeReason")}
                />{" "}
                Диета
              </label>

              <label>
                <input
                  type="radio"
                  value="sport"
                  {...register("primaryExam.weightChangeReason")}
                />{" "}
                Спорт
              </label>
            </div>

            <Field noteKey="primaryExam.weightChangeReasonDetails">
              <Input
                label="Комментарий к причине (необязательно)"
                {...register("primaryExam.weightChangeReasonDetails" as never)}
              />
            </Field>
          </>
        )}
      </fieldset>

      <div className={styles.radioGroup}>
        <label>Подозрение / утверждение диагноза</label>

        <label>
          <input
            type="radio"
            value="type1"
            {...register("primaryExam.suspectedDiagnosis")}
          />{" "}
          СД 1 типа
        </label>

        <label>
          <input
            type="radio"
            value="type2"
            {...register("primaryExam.suspectedDiagnosis")}
          />{" "}
          СД 2 типа
        </label>

        {errors.primaryExam?.suspectedDiagnosis && (
          <span className={styles.error}>
            {errors.primaryExam.suspectedDiagnosis.message}
          </span>
        )}
      </div>

      {/* ======================= СД 1 типа ======================= */}
      {isType1 && type1Data && (
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
                  {...register(
                    "type1Diabetes.classicSymptoms.lossOfConsciousness",
                  )}
                />{" "}
                Потеря сознания
              </label>
            </fieldset>
          </Field>

          <YesNo
            label="Обращение к эндокринологу после обнаружения гипергликемии"
            name="type1Diabetes.investigatedAfterDetection"
            register={register}
            yesNoLabels={["Было", "Не было"]}
          />

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

          {/* ===== C-пептид ===== */}
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

          {/* ===== Гликированный гемоглобин ===== */}
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
        </div>
      )}

      {/* ======================= СД 2 типа ======================= */}
      {isType2 && type2Data && (
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
          </fieldset>

          <Field noteKey="type2Diabetes.maxGlucoseValues">
            <Textarea
              label="Максимально зафиксированные значения глюкозы"
              {...register("type2Diabetes.maxGlucoseValues")}
              rows={2}
            />
          </Field>

          <YesNo
            label="Вы обратились к эндокринологу после обнаружения повышенного результата?"
            name="type2Diabetes.investigatedAfterDetection"
            register={register}
          />

          {/* ===== Гликированный гемоглобин СД2 ===== */}
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
        </div>
      )}
    </>
  );
};
