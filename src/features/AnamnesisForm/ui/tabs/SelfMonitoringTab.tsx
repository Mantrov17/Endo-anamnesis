import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../Field";

import { YesNo } from "../YesNo";

import styles from "../styles.module.scss";

const toNullableNumber = (value: unknown): number | null => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
};

export const SelfMonitoringTab: React.FC = () => {
  const { register, watch, setValue } = useFormContext<AnamnesisFormData>();

  const hasGlucometer = watch("selfMonitoring.hasGlucometer") === true;

  const glucoseSensor = watch("selfMonitoring.glucoseSensor") === true;

  const noMonitoringDevices =
    watch("selfMonitoring.noMonitoringDevices") === true;

  const isPump =
    watch("primaryExam.suspectedDiagnosis") === "type1" &&
    watch("type1Diabetes.initialTherapy.injectionMethod") === "pump";

  const isType1 = watch("primaryExam.suspectedDiagnosis") === "type1";

  const handleLipodystrophyChange = (
    kind: "lipohypertrophy" | "lipoatrophy" | "none",
    checked: boolean,
  ) => {
    if (!checked) {
      return;
    }

    if (kind === "none") {
      setValue(
        "selfMonitoring.injectionSiteCondition.lipodystrophy.lipohypertrophy",
        false,
        { shouldDirty: true, shouldTouch: true },
      );

      setValue(
        "selfMonitoring.injectionSiteCondition.lipodystrophy.lipoatrophy",
        false,
        { shouldDirty: true, shouldTouch: true },
      );
    } else {
      setValue(
        "selfMonitoring.injectionSiteCondition.lipodystrophy.none",
        false,
        { shouldDirty: true, shouldTouch: true },
      );
    }
  };

  const handleGlucometerChange = (checked: boolean) => {
    setValue("selfMonitoring.hasGlucometer", checked, {
      shouldDirty: true,
    });

    if (checked) {
      setValue("selfMonitoring.noMonitoringDevices", false, {
        shouldDirty: true,
      });
    }
  };

  const handleGlucoseSensorChange = (checked: boolean) => {
    setValue("selfMonitoring.glucoseSensor", checked, {
      shouldDirty: true,
    });

    if (checked) {
      setValue("selfMonitoring.noMonitoringDevices", false, {
        shouldDirty: true,
      });
    }
  };

  const handleNoDevicesChange = (checked: boolean) => {
    setValue("selfMonitoring.noMonitoringDevices", checked, {
      shouldDirty: true,
    });

    if (checked) {
      setValue("selfMonitoring.hasGlucometer", false, {
        shouldDirty: true,
      });

      setValue("selfMonitoring.glucoseSensor", false, {
        shouldDirty: true,
      });
    }
  };

  return (
    <div className={styles.section}>
      <h3>Самоконтроль</h3>

      {/* ====================
          1. Место инъекций
          ==================== */}

      <fieldset className={styles.fieldset}>
        <legend>Место инъекций</legend>

        <div
          className={`${styles.selfMonitoringChoiceGrid} ${styles.selfMonitoringDeviceOptions}`}
        >
          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.injectionSites.abdomen")}
            />
            <span>Живот</span>
          </label>

          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.injectionSites.thighs")}
            />
            <span>Наружная поверхность бедер</span>
          </label>

          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.injectionSites.buttocks")}
            />
            <span>Верхний наружный квадрант ягодиц</span>
          </label>

          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.injectionSites.lumbar")}
            />
            <span>Поясничная область</span>
          </label>

          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.injectionSites.shoulders")}
            />
            <span>Наружная поверхность плеча</span>
          </label>
        </div>

        {/* Новое компактное поле.
            Сохраняется в selfMonitoring.injectionSitesDetails.
            Автоматически расширяется при вводе текста. */}

        <div className={styles.selfMonitoringDetailsField}>
          <Textarea
            label="Подробнее"
            placeholder="Дополнительные сведения о местах инъекций"
            rows={1}
            className={styles.selfMonitoringDetailsTextarea}
            {...register("selfMonitoring.injectionSitesDetails")}
          />
        </div>
      </fieldset>

      {/* ====================
          2. Устройства
          ==================== */}

      <fieldset className={styles.fieldset}>
        <legend>Устройства для самоконтроля?</legend>

        <div
          className={`${styles.selfMonitoringChoiceGrid} ${styles.selfMonitoringDeviceOptions}`}
        >
          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.hasGlucometer")}
              checked={hasGlucometer}
              onChange={(event) => handleGlucometerChange(event.target.checked)}
            />
            <span>Глюкометр</span>
          </label>

          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.glucoseSensor")}
              checked={glucoseSensor}
              onChange={(event) =>
                handleGlucoseSensorChange(event.target.checked)
              }
            />
            <span>Датчик непрерывного мониторинга</span>
          </label>

          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.noMonitoringDevices")}
              checked={noMonitoringDevices}
              onChange={(event) => handleNoDevicesChange(event.target.checked)}
            />
            <span>Нет</span>
          </label>
        </div>
      </fieldset>

      {/* ====================
          3. Регулярность
          ==================== */}

      <div className={styles.radioGroup}>
        <label>Регулярность самоконтроля</label>

        <label>
          <input
            type="radio"
            value="regular"
            {...register("selfMonitoring.frequencyRegularity")}
          />{" "}
          Регулярно
        </label>

        <label>
          <input
            type="radio"
            value="irregular"
            {...register("selfMonitoring.frequencyRegularity")}
          />{" "}
          Нерегулярно
        </label>
      </div>

      {/* ====================
          4. Частота
          ==================== */}

      <div className={styles.selfMonitoringNarrowField}>
        <Input
          label="Частота самоконтроля"
          placeholder="Например: 3 раза в день"
          {...register("selfMonitoring.frequency")}
        />
      </div>

      {/* ====================
          5. Дневник
          ==================== */}

      <YesNo
        label="Ведение дневника самоконтроля"
        name="selfMonitoring.diary"
        register={register}
      />

      {/* ====================
          6. Средняя гликемия
          ==================== */}

      <div className={styles.selfMonitoringRange}>
        <div className={styles.selfMonitoringRangeHeading}>
          Средние показатели гликемии на фоне проводимой терапии
        </div>

        <div className={styles.selfMonitoringRangeFields}>
          <Input
            label="От"
            type="number"
            min={0}
            max={50}
            step="0.1"
            inputMode="decimal"
            suffix="ммоль/л"
            placeholder="5.0"
            {...register("selfMonitoring.averageGlucoseMin", {
              setValueAs: toNullableNumber,
            })}
          />

          <Input
            label="До"
            type="number"
            min={0}
            max={50}
            step="0.1"
            inputMode="decimal"
            suffix="ммоль/л"
            placeholder="8.0"
            {...register("selfMonitoring.averageGlucoseMax", {
              setValueAs: toNullableNumber,
            })}
          />
        </div>
      </div>

      {/* ====================
          7. Техника инъекций
          ==================== */}

      <div className={styles.radioGroup}>
        <label>Техника инъекций</label>

        <label>
          <input
            type="radio"
            value="correct"
            {...register("selfMonitoring.injectionTechnique")}
          />{" "}
          Правильная
        </label>

        <label>
          <input
            type="radio"
            value="incorrect"
            {...register("selfMonitoring.injectionTechnique")}
          />{" "}
          Неправильная
        </label>
      </div>

      {/* ====================
          8. Длина игл
          ==================== */}

      <fieldset className={styles.fieldset}>
        <legend>Длина игл</legend>

        <div className={styles.selfMonitoringChoiceGrid}>
          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.needleLengths.mm4")}
            />
            <span>4 мм</span>
          </label>

          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.needleLengths.mm5")}
            />
            <span>5 мм</span>
          </label>

          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.needleLengths.mm6")}
            />
            <span>6 мм</span>
          </label>

          <label>
            <input
              type="checkbox"
              {...register("selfMonitoring.needleLengths.mm12")}
            />
            <span>12 мм</span>
          </label>
        </div>
      </fieldset>

      {/* ====================
          9. Частота смены игл / наборов
          ==================== */}

      <div className={styles.selfMonitoringNarrowField}>
        <Input
          label={
            isPump ? "Частота смены инфузионных наборов" : "Частота смены игл"
          }
          placeholder={
            isPump
              ? "Например: каждые 3 дня"
              : "Например: после каждой инъекции"
          }
          {...register("selfMonitoring.needleChangeFrequency")}
        />
      </div>

      {/* ====================
          10. Частота смены мест инъекций
          ==================== */}

      <div className={styles.selfMonitoringNarrowField}>
        <Input
          label="Частота смены мест инъекций"
          placeholder="Например: каждые 3 дня"
          {...register("selfMonitoring.injectionSiteChangeFrequency")}
        />
      </div>

      {/* ====================
          11. Состояние мест инъекций
          ==================== */}

      <Field
        noteKey={
          isType1
            ? "type1Diabetes.injectionSitesInfo"
            : "selfMonitoring.injectionSiteCondition"
        }
      >
        <fieldset className={styles.fieldset}>
          <legend>Состояние мест инъекций</legend>

          <fieldset className={styles.fieldset}>
            <legend>Липодистрофии</legend>

            <div
              className={`${styles.selfMonitoringChoiceGrid} ${styles.selfMonitoringDeviceOptions}`}
            >
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "selfMonitoring.injectionSiteCondition.lipodystrophy.lipohypertrophy",
                    {
                      onChange: (event) =>
                        handleLipodystrophyChange(
                          "lipohypertrophy",
                          event.target.checked,
                        ),
                    },
                  )}
                />
                <span>Липогипертрофии</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  {...register(
                    "selfMonitoring.injectionSiteCondition.lipodystrophy.lipoatrophy",
                    {
                      onChange: (event) =>
                        handleLipodystrophyChange(
                          "lipoatrophy",
                          event.target.checked,
                        ),
                    },
                  )}
                />
                <span>Липоатрофии</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  {...register(
                    "selfMonitoring.injectionSiteCondition.lipodystrophy.none",
                    {
                      onChange: (event) =>
                        handleLipodystrophyChange("none", event.target.checked),
                    },
                  )}
                />
                <span>Отсутствуют</span>
              </label>
            </div>
          </fieldset>

          <YesNo
            label="Болезненность при пальпации"
            name="selfMonitoring.injectionSiteCondition.tenderness"
            register={register}
          />

          <YesNo
            label="Гиперемия"
            name="selfMonitoring.injectionSiteCondition.hyperemia"
            register={register}
          />

          <div className={styles.radioGroup}>
            <label>Температура кожи</label>

            <label>
              <input
                type="radio"
                value="hyperthermia"
                {...register(
                  "selfMonitoring.injectionSiteCondition.skinTemperature",
                )}
              />{" "}
              Гипертермия
            </label>

            <label>
              <input
                type="radio"
                value="normal"
                {...register(
                  "selfMonitoring.injectionSiteCondition.skinTemperature",
                )}
              />{" "}
              Нормотермия
            </label>
          </div>
        </fieldset>
      </Field>

      {/* ====================
          12. Хранение инсулина
          ==================== */}

      <div className={styles.radioGroup}>
        <label>Хранение инсулина</label>

        <label>
          <input
            type="radio"
            value="correct"
            {...register("selfMonitoring.insulinStorage")}
          />{" "}
          Правильное
        </label>

        <label>
          <input
            type="radio"
            value="incorrect"
            {...register("selfMonitoring.insulinStorage")}
          />{" "}
          Неправильное
        </label>
      </div>

      {/* ====================
          13. Питание
          ==================== */}

      <div className={styles.radioGroup}>
        <label>Питание</label>

        <label>
          <input
            type="radio"
            value="regular"
            {...register("selfMonitoring.mealRegularity")}
          />{" "}
          Регулярное
        </label>

        <label>
          <input
            type="radio"
            value="irregular"
            {...register("selfMonitoring.mealRegularity")}
          />{" "}
          Нерегулярное
        </label>
      </div>

      {/* ====================
          14. Диета
          ==================== */}

      <YesNo
        label="Диета"
        name="selfMonitoring.dietAdherence"
        register={register}
        yesNoLabels={["Придерживается", "Нет"]}
      />

      <Field
        noteKey="selfMonitoring.general"
        noteLabel="Примечание по самоконтролю"
      >
        <div />
      </Field>
    </div>
  );
};
