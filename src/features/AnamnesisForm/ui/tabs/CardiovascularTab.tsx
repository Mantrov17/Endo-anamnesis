import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { calculateAge } from "../../lib/calculations";

import { DrugList } from "../DrugList";

import { YesNo } from "../YesNo";

import styles from "../styles.module.scss";

type LifestyleData = NonNullable<AnamnesisFormData["lifestyle"]>;

type SymptomKey = keyof NonNullable<LifestyleData["hypertensionSymptoms"]>;

type CrisisKey = keyof NonNullable<LifestyleData["crisisSigns"]>;

type MedicineKey = keyof NonNullable<
  LifestyleData["medicationHypertensionTriggers"]
>;

const symptoms: { key: SymptomKey; label: string }[] = [
  {
    key: "headache",
    label: "Головные боли в темянной и затылочной области",
  },
  { key: "tinnitus", label: "Шум в ушах" },
  {
    key: "visualDisturbances",
    label: "Мелькание мушек или сетка перед глазами",
  },
  { key: "palpitations", label: "Чувство сердцебиения" },
  { key: "hotFlushes", label: "Чувство жара" },
  { key: "chestPain", label: "Боли в сердце" },
  { key: "arrhythmia", label: "Нарушения ритма" },
  { key: "dizziness", label: "Головокружение" },
  { key: "nauseaVomiting", label: "Тошнота, рвота" },
];

const crisisSigns: { key: CrisisKey; label: string }[] = [
  { key: "severeHeadache", label: "Сильная головная боль" },
  { key: "speechDisorder", label: "Нарушение речи" },
  { key: "visionDisorder", label: "Нарушение зрения" },
  { key: "limbWeakness", label: "Слабость в конечностях" },
  { key: "seizures", label: "Судороги" },
  { key: "lossOfConsciousness", label: "Потеря сознания" },
];

const medicationTriggers: {
  key: MedicineKey;
  label: string;
  femaleOnly?: boolean;
}[] = [
  { key: "glucocorticoids", label: "ГКС" },
  {
    key: "combinedOralContraceptives",
    label: "КОКи",
    femaleOnly: true,
  },
  { key: "bronchodilators", label: "Бронхолитики" },
  { key: "erythropoietin", label: "Эритропоэтин" },
  {
    key: "antiretroviralTherapy",
    label: "Антиретровирусная терапия",
  },
  {
    key: "licoriceSupplements",
    label: "БАДы (солодка, лакрица)",
  },
  {
    key: "immunosuppressants",
    label: "Иммуносупрессанты (циклоспорин, такролимус, сиролимус)",
  },
];

interface TargetBP {
  systolicMin: number;
  systolicMax: number;
  diastolicMin: number;
  diastolicMax: number;
}

const targetForAge = (age: number | null): TargetBP | null => {
  if (age !== null && age >= 30 && age <= 64) {
    return {
      systolicMin: 120,
      systolicMax: 129,
      diastolicMin: 70,
      diastolicMax: 79,
    };
  }

  if (age !== null && age >= 65 && age <= 79) {
    return {
      systolicMin: 130,
      systolicMax: 139,
      diastolicMin: 70,
      diastolicMax: 79,
    };
  }

  return null;
};

const parseBP = (value: string): [number, number] | null => {
  const match = value.trim().match(/^(\d{2,3})\s*[/\\]\s*(\d{2,3})$/);

  if (!match) {
    return null;
  }

  const systolic = Number(match[1]);
  const diastolic = Number(match[2]);

  return systolic > 0 && diastolic > 0 ? [systolic, diastolic] : null;
};

const detectedBefore35 = (value: string, birthDate?: string): boolean => {
  const trimmed = value.trim();

  if (!/^\d{1,4}$/.test(trimmed)) {
    return false;
  }

  const numberValue = Number(trimmed);

  if (trimmed.length <= 2) {
    return numberValue < 35;
  }

  if (trimmed.length !== 4 || !birthDate) {
    return false;
  }

  const birthYear = Number(birthDate.slice(0, 4));

  return (
    birthYear >= 1900 &&
    numberValue >= birthYear &&
    numberValue - birthYear < 35
  );
};

export const CardiovascularTab: React.FC = () => {
  const { register, watch, setValue, control } =
    useFormContext<AnamnesisFormData>();

  const hasAH = watch("lifestyle.knownHypertension") === "yes";

  const birthDate = watch("birthDate");

  const age = calculateAge(birthDate);

  const target = targetForAge(age);

  const gender = watch("gender");

  const diagnosedAt = watch("lifestyle.hypertensionFirstDetected") ?? "";

  const previousUnder35 = watch("lifestyle.hypertensionUnderAge35") === true;

  const under35 = detectedBefore35(diagnosedAt, birthDate) || previousUnder35;

  const detectionEnabled = watch("lifestyle.hypertensionDetectionEnabled");

  const detectionMethod = watch("lifestyle.hypertensionDetectionMethod") ?? "";

  const showDetection =
    detectionEnabled === true ||
    (detectionEnabled == null && Boolean(detectionMethod));

  const changedTherapy = boolFromString(
    watch("lifestyle.doctorChangedTherapy"),
  );

  const regularTherapy = boolFromString(watch("lifestyle.therapyRegularity"));

  const hadCrisis = boolFromString(
    watch("lifestyle.hypertensiveCrisesAmbulance"),
  );

  const resistant = boolFromString(watch("lifestyle.bpResistant3Drugs"));

  const currentBP = watch("lifestyle.bpOnTherapy") ?? "";

  const parsedCurrentBP = parseBP(currentBP);

  const atTarget =
    target && parsedCurrentBP
      ? parsedCurrentBP[0] >= target.systolicMin &&
        parsedCurrentBP[0] <= target.systolicMax &&
        parsedCurrentBP[1] >= target.diastolicMin &&
        parsedCurrentBP[1] <= target.diastolicMax
      : false;

  const aboveTarget =
    target && parsedCurrentBP
      ? parsedCurrentBP[0] > target.systolicMax ||
        parsedCurrentBP[1] > target.diastolicMax
      : false;

  const rawMaxBP = watch("lifestyle.maxBPValues") ?? "";

  const maxMatch = rawMaxBP.match(/^\s*(\d*)\s*\/\s*(\d*)/);

  const maximumSys = maxMatch ? maxMatch[1] : "";

  const maximumDia = maxMatch ? maxMatch[2] : "";

  const setMaximumBP = (sys: string, dia: string) => {
    const nextValue = sys || dia ? `${sys}/${dia}` : "";

    setValue("lifestyle.maxBPValues", nextValue, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className={styles.section}>
      <h3>Сердечно-сосудистая система</h3>

      <div className={styles.radioGroup}>
        <label>Поставлен ли диагноз «Артериальная гипертензия»?</label>

        <label>
          <input
            type="radio"
            value="yes"
            {...register("lifestyle.knownHypertension")}
          />{" "}
          Да
        </label>

        <label>
          <input
            type="radio"
            value="no"
            {...register("lifestyle.knownHypertension")}
          />{" "}
          Нет
        </label>
      </div>

      {hasAH && (
        <>
          <div className={styles.cvTargetNotice} role="note">
            <strong>Целевые значения АД</strong>

            {target ? (
              <span>
                {target.systolicMin}–{target.systolicMax}/{target.diastolicMin}–
                {target.diastolicMax} мм рт. ст. (возраст {age} лет)
              </span>
            ) : (
              <span>
                Для возраста {age === null ? "не указан" : `${age} лет`}{" "}
                диапазон в задании не определён — автоматическую оценку не
                проводим.
              </span>
            )}
          </div>

          <div className={styles.cvFieldTitle}>
            <span>
              Когда впервые зафиксировано повышение АД? (год или возраст)
            </span>

            {under35 && (
              <span
                title="Повышение АД до 35 лет"
                aria-label="Флаг: выявление до 35 лет"
              >
                🚩
              </span>
            )}
          </div>

          <div className={styles.cvNarrowField}>
            <input
              className={styles.cvTextInput}
              inputMode="numeric"
              placeholder="Например: 2018 или 32"
              {...register("lifestyle.hypertensionFirstDetected")}
            />
          </div>

          <label className={styles.cvSwitchLine}>
            <span>Условия выявления АГ?</span>

            <input
              type="checkbox"
              role="switch"
              checked={showDetection}
              onChange={(event) =>
                setValue(
                  "lifestyle.hypertensionDetectionEnabled",
                  event.target.checked,
                  { shouldDirty: true },
                )
              }
            />

            <span className={styles.cvSwitchTrack} aria-hidden="true" />
          </label>

          {showDetection && (
            <>
              <fieldset className={styles.fieldset}>
                <legend>Условия выявления</legend>

                {(
                  [
                    ["accidental", "Случайно дома"],
                    ["dispanserization", "Диспансеризация"],
                    ["withComplaints", "При наличии жалоб"],
                    ["hospitalization", "Во время госпитализации"],
                    ["ems", "СМП"],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      value={value}
                      {...register("lifestyle.hypertensionDetectionMethod")}
                    />{" "}
                    {label}
                  </label>
                ))}
              </fieldset>

              <Textarea
                label="Подробнее"
                rows={2}
                {...register("lifestyle.hypertensionDetectionDetails")}
              />
            </>
          )}

          <div className={styles.cvFieldTitle}>
            Максимально высокие значения АД
          </div>

          <div className={styles.cvBpPair}>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={300}
              aria-label="Максимальное систолическое АД"
              value={maximumSys}
              onChange={(event) => setMaximumBP(event.target.value, maximumDia)}
            />

            <span>/</span>

            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={200}
              aria-label="Максимальное диастолическое АД"
              value={maximumDia}
              onChange={(event) => setMaximumBP(maximumSys, event.target.value)}
            />

            <span>мм рт. ст.</span>
          </div>

          <YesNo
            label="Обращение к врачу-терапевту?"
            name="lifestyle.visitedDoctorAfterDetection"
            register={register}
          />

          <Textarea
            label="Инициированная антигипертензивная терапия"
            rows={2}
            {...register("lifestyle.prescribedTherapyThen")}
          />

          <fieldset
            className={`${styles.fieldset} ${styles.insulinTherapyFieldset}`}
          >
            <legend>Актуальная антигипертензивная терапия</legend>

            <DrugList
              control={control}
              register={register}
              name="lifestyle.actualAntihypertensiveTherapy"
              firstField="name"
            />
          </fieldset>

          <YesNo
            label="Коррекция терапии?"
            name="lifestyle.doctorChangedTherapy"
            register={register}
          />

          {changedTherapy === true && (
            <>
              <Textarea
                label="Причина коррекции терапии"
                rows={2}
                {...register("lifestyle.therapyCorrectionReason")}
              />

              <Textarea
                label="Скорректированная терапия"
                rows={2}
                {...register("lifestyle.changedTherapyDetails")}
              />
            </>
          )}

          <YesNo
            label="Приверженность приёма терапии?"
            yesNoLabels={["Высокая", "Низкая"]}
            name="lifestyle.therapyRegularity"
            register={register}
          />

          {regularTherapy === false && (
            <div className={styles.cvAdviceBox}>
              <strong>Низкая приверженность</strong>

              <Textarea
                label="Что мешает принимать регулярно?"
                rows={2}
                {...register("lifestyle.missedReasons")}
              />

              <Input
                label="Сколько раз в неделю пропускает приём?"
                {...register("lifestyle.missedDosesPerWeek")}
              />

              <span>
                Здесь можно будет разместить рекомендации для пациента.
              </span>
            </div>
          )}

          <YesNo
            label="Самостоятельная отмена терапии?"
            name="lifestyle.selfDiscontinued"
            register={register}
          />

          <Input
            label="Давление на настоящей терапии?"
            placeholder="Например: 125/75"
            {...register("lifestyle.bpOnTherapy")}
          />

          {target && parsedCurrentBP && (
            <div
              className={
                atTarget
                  ? styles.cvTargetNotice
                  : aboveTarget
                    ? styles.cvWarningNotice
                    : styles.cvNeutralNotice
              }
              role="status"
            >
              {atTarget
                ? "По введённому значению АД целевой диапазон достигнут."
                : aboveTarget
                  ? "По введённому значению АД целевой диапазон не достигнут: давление выше указанного диапазона."
                  : "АД ниже указанного целевого диапазона — требуется оценка врача."}
            </div>
          )}

          {currentBP.trim() && !parsedCurrentBP && (
            <p className={styles.cvMuted}>
              Для оценки цели введите давление в формате 125/75.
            </p>
          )}

          {aboveTarget && (
            <div className={styles.cvFlagQuestion}>
              <YesNo
                label="Сохраняется ли повышенное давление при приёме ≥3 препаратов (включая диуретик)?"
                name="lifestyle.bpResistant3Drugs"
                register={register}
              />

              {resistant === false && (
                <span
                  className={styles.cvFlag}
                  title="Отмечено по заданному правилу"
                >
                  🚩
                </span>
              )}
            </div>
          )}

          <fieldset className={styles.fieldset}>
            <legend>Субъективные жалобы при повышении АД</legend>

            <div className={styles.cvChecks}>
              {symptoms.map(({ key, label }) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    {...register(
                      `lifestyle.hypertensionSymptoms.${key}` as const,
                    )}
                  />
                  {label}
                </label>
              ))}
            </div>

            <Textarea
              label="Подробнее о жалобах"
              rows={2}
              {...register("lifestyle.subjectiveComplaints")}
            />
          </fieldset>

          <Textarea
            label="Чем снижаете высокие подъёмы давления?"
            rows={2}
            {...register("lifestyle.highBpReliefMedication")}
          />

          <p className={styles.cvMuted}>
            Подсказка: Каптотен — каптоприл; Коринфар — нифедипин; Физиотенз,
            Моксарел, Вазотайм — моксонидин. Уточняйте действующее вещество по
            упаковке.
          </p>

          <Input
            label="При каком давлении снижаете давление?"
            {...register("lifestyle.atWhatBPReduced")}
          />

          <YesNo
            label="Домашнее мониторирование АД"
            name="lifestyle.measureAtHome"
            register={register}
          />

          <Input
            label="Частота измерения?"
            {...register("lifestyle.measureFrequency")}
          />

          <YesNo
            label="Дневник АД"
            name="lifestyle.keepDiary"
            register={register}
          />

          <YesNo
            label="⚠️ Кризы, требующие вызова скорой в анамнезе?"
            name="lifestyle.hypertensiveCrisesAmbulance"
            register={register}
          />

          {hadCrisis === true && (
            <>
              <div className={styles.cvNarrowField}>
                <Input
                  label="Сколько раз?"
                  type="number"
                  min={0}
                  step={1}
                  {...register("lifestyle.crisesCount")}
                />
              </div>

              <fieldset className={styles.fieldset}>
                <legend>Клиническая картина криза</legend>

                <div className={styles.cvChecks}>
                  {crisisSigns.map(({ key, label }) => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        {...register(`lifestyle.crisisSigns.${key}` as const)}
                      />
                      {label}
                    </label>
                  ))}
                </div>

                <Textarea
                  label="Другие сведения о кризах"
                  rows={2}
                  {...register("lifestyle.crisesSymptoms")}
                />
              </fieldset>
            </>
          )}

          <fieldset className={styles.fieldset}>
            <legend>💊 Исключение лекарственной АГ</legend>

            <Textarea
              label="Как часто принимаете НПВС и парацетамол?"
              rows={2}
              {...register("secondaryHypertension.nsaidsFrequency")}
            />

            <Textarea
              label="Как часто принимаете назальные капли (деконгестанты)?"
              rows={2}
              {...register("secondaryHypertension.decongestantsFrequency")}
            />

            <div className={styles.cvChecks}>
              {medicationTriggers
                .filter((item) => !item.femaleOnly || gender === "female")
                .map(({ key, label }) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      {...register(
                        `lifestyle.medicationHypertensionTriggers.${key}` as const,
                      )}
                    />
                    {label}
                  </label>
                ))}
            </div>

            <Textarea
              label="Дополнительные сведения о препаратах"
              rows={2}
              {...register("secondaryHypertension.otherDrugs")}
            />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Другие сведения о сердечно-сосудистой системе</legend>

            <YesNo
              label="Ритм сердца правильный?"
              name="lifestyle.heartRhythmRegular"
              register={register}
            />

            <YesNo
              label="Кардиостимулятор?"
              name="lifestyle.pacemakers"
              register={register}
            />

            <YesNo
              label="Мерцательная аритмия?"
              name="lifestyle.atrialFibrillation"
              register={register}
            />
          </fieldset>
        </>
      )}
    </div>
  );
};
