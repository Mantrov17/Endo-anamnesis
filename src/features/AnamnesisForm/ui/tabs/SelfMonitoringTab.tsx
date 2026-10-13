import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

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
          8. Смена места инъекции
          ==================== */}

      <div className={styles.selfMonitoringNarrowField}>
        <Input
          label="Частота смены места для инъекции"
          placeholder="Например: каждые 3 дня"
          {...register("selfMonitoring.injectionSiteChangeFrequency")}
        />
      </div>

      {/* ====================
          9. Длина игл
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
          10. Частота смены игл
          ==================== */}

      <div className={styles.selfMonitoringNarrowField}>
        <Input
          label="Частота смены игл"
          placeholder="Например: после каждой инъекции"
          {...register("selfMonitoring.needleChangeFrequency")}
        />
      </div>

      {/* ====================
          11. Хранение инсулина
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
          12. Питание
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
          13. Диета
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
