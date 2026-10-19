import React, { useState } from "react";

import { type Path, useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { boolFromString } from "@/shared/lib/boolFromString";

import { DateField } from "@/shared/ui/DateInput";
import { Input } from "@/shared/ui/Input";

import { YesNo } from "../YesNo";

import eyeInjectionImage from "@/shared/assets/eyes/eyeInjection.png";
import normalEyeIcon from "@/shared/assets/eyes/normalEye.png";
import crossedEyeIcon from "@/shared/assets/eyes/crossedEye.png";

import styles from "../styles.module.scss";

type EyesData = NonNullable<AnamnesisFormData["eyes"]>;

type OtherSymptomKey = keyof EyesData["otherSymptoms"];
type ExternalSignKey = keyof EyesData["externalExam"];
type NamedSignKey = keyof EyesData["namedSigns"];
type SurgeryKey = keyof EyesData["surgeries"];

const EYE_SIDES = [
  { value: "OS", label: "OS — левый" },
  { value: "OD", label: "OD — правый" },
  { value: "OU", label: "OU — оба" },
] as const;

const PERIODIC_TRIGGERS = [
  { name: "eyes.periodicTriggers.highBP", label: "При повышении АД" },
  { name: "eyes.periodicTriggers.lowBP", label: "При понижении АД" },
  {
    name: "eyes.periodicTriggers.highGlucose",
    label: "При повышении уровня глюкозы",
  },
  {
    name: "eyes.periodicTriggers.lowGlucose",
    label: "При понижении уровня глюкозы",
  },
] as const;

const VISUAL_PHENOMENA = [
  {
    name: "eyes.visualPhenomena.floaters",
    label: 'Плавающие помутнения ("мушки")',
  },
  {
    name: "eyes.visualPhenomena.photopsias",
    label: "Фотопсии (вспышки света)",
  },
  { name: "eyes.visualPhenomena.sparks", label: "Искры" },
  { name: "eyes.visualPhenomena.grid", label: "Сетка" },
  {
    name: "eyes.visualPhenomena.colorDistortion",
    label: "Искажение цветовосприятия",
  },
] as const;

const OTHER_SYMPTOMS: {
  key: OtherSymptomKey;
  label: string;
}[] = [
  { key: "pain", label: "Боль и резь в глазах" },
  { key: "tearing", label: "Слёзотечение" },
  { key: "dryness", label: "Сухость" },
  { key: "sandSensation", label: "Ощущение песка" },
  { key: "photophobia", label: "Светобоязнь" },
];

const EXTERNAL_SIGNS: {
  key: ExternalSignKey;
  label: string;
  score?: boolean;
}[] = [
  { key: "ptosis", label: "Птоз века" },
  { key: "miosis", label: "Миоз" },
  { key: "mydriasis", label: "Мидриаз" },
  { key: "enophthalmos", label: "Энофтальм" },
  { key: "eyelidEdema", label: "Отёк век", score: true },
  {
    key: "caruncleInflammation",
    label: "Воспаление карункулы (слёзного мясца)",
    score: true,
  },
  { key: "hemophthalmos", label: "Гемофтальм" },
  { key: "hyphema", label: "Гифема" },
];

const INJECTION_TYPES = [
  { value: "normal", label: "Норма" },
  { value: "conjunctival", label: "Конъюнктивальная" },
  { value: "pericorneal", label: "Перикорнеальная" },
  { value: "mixed", label: "Смешанная" },
] as const;

const HEMIANOPIA_TYPES = [
  { value: "homonymous", label: "Гомонимная гемианопсия" },
  { value: "heteronymous", label: "Гетеронимная гемианопсия" },
  {
    value: "heteronymousBitemporal",
    label: "Гетеронимная битемпоральная гемианопсия",
  },
  {
    value: "homonymousBitemporal",
    label: "Гомонимная битемпоральная гемианопсия",
  },
] as const;

const SURGERIES: {
  key: SurgeryKey;
  label: string;
}[] = [
  {
    key: "retinalLaser",
    label: "Лазерная коагуляция сетчатки глаза",
  },
  { key: "lensReplacement", label: "Замена хрусталика" },
  {
    key: "intravitrealInjection",
    label: "Интравитреальные инъекции",
  },
];

const MOVEMENT_DIRECTIONS = [
  {
    key: "up",
    label: "Вверх (нижняя прямая мышца)",
    score: true,
  },
  {
    key: "outward",
    label: "Наружу (медиальная прямая мышца)",
    score: false,
  },
  {
    key: "down",
    label: "Вниз (верхняя прямая мышца)",
    score: true,
  },
  {
    key: "inward",
    label: "Внутрь (латеральная прямая мышца)",
    score: false,
  },
] as const;

const NAMED_SIGNS: {
  key: NamedSignKey;
  name: string;
  description: string;
}[] = [
  {
    key: "stellwag",
    name: "Симптом Штельвага",
    description: "Редкое моргание, «неподвижный взгляд»",
  },
  {
    key: "moebius",
    name: "Симптом Мебиуса",
    description: "Слабость конвергенции",
  },
  {
    key: "graefe",
    name: "Симптом Грефе",
    description:
      "Отставание верхнего века от радужной оболочки при взгляде вниз; белая полоска склеры",
  },
  {
    key: "kocher",
    name: "Симптом Кохера",
    description:
      "Отставание нижнего века от радужной оболочки при взгляде вверх; белая полоска склеры",
  },
  {
    key: "horner",
    name: "Синдром Горнера",
    description: "Птоз, миоз, энофтальм",
  },
  {
    key: "marie",
    name: "Синдром Мари",
    description:
      "Повышенная возбудимость, снижение концентрации внимания, дрожь, плаксивость",
  },
  {
    key: "jellinek",
    name: "Симптом Еллинека",
    description: "Потемнение кожи вокруг глаз",
  },
  {
    key: "dalrymple",
    name: "Симптом Дальримпля",
    description:
      "Широкая глазная щель, лагофтальм (невозможность полного смыкания век)",
  },
  {
    key: "joffroy",
    name: "Симптом Жоффруа",
    description: "Отсутствие наморщивания лба при взгляде вверх",
  },
  {
    key: "botkin",
    name: "Симптом Боткина",
    description:
      "Мимолётное широкое раскрытие глазных щелей при фиксации взгляда",
  },
  {
    key: "rosenbach",
    name: "Симптом Розенбаха",
    description: "Мелкий тремор закрытых век",
  },
  {
    key: "repnevMelekhov",
    name: "Симптом Репнева — Мелехова",
    description: "Гневный взгляд",
  },
];

/** Возраст на дату начала ухудшения зрения. */
const getAgeAtDate = (
  birthDate?: string,
  eventDate?: string,
): number | null => {
  if (!birthDate || !eventDate) return null;

  const birth = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  const event = /^(\d{4})-(\d{2})-(\d{2})$/.exec(eventDate);

  if (!birth || !event) return null;

  const by = Number(birth[1]);
  const bm = Number(birth[2]);
  const bd = Number(birth[3]);

  const ey = Number(event[1]);
  const em = Number(event[2]);
  const ed = Number(event[3]);

  const age = ey - by - (em < bm || (em === bm && ed < bd) ? 1 : 0);

  return age >= 0 && age <= 130 ? age : null;
};

/** Универсальный выбор стороны для отдельного проявления. */
const EyeSidePicker: React.FC<{
  name: Path<AnamnesisFormData>;
  label?: string;
}> = ({ name, label = "Какой глаз?" }) => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <fieldset className={styles.eyesSideGroup}>
      <legend>{label}</legend>

      <div className={styles.eyesSideOptions}>
        {EYE_SIDES.map((side) => (
          <label key={side.value}>
            <input type="radio" value={side.value} {...register(name)} />
            <span>{side.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

/** Один симптом с самостоятельным выбором OS / OD / OU. */
const SymptomWithSide: React.FC<{
  name:
    | `eyes.otherSymptoms.${OtherSymptomKey}`
    | `eyes.externalExam.${ExternalSignKey}`;
  label: string;
  score?: boolean;
}> = ({ name, label, score }) => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const presentPath = `${name}.present` as Path<AnamnesisFormData>;

  const sidePath = `${name}.eye` as Path<AnamnesisFormData>;

  const selected = watch(presentPath) === true;

  return (
    <div className={styles.eyesSymptomItem}>
      <label
        className={`${styles.eyesCheckboxCard} ${
          selected ? styles.eyesCheckboxSelected : ""
        }`}
      >
        <input type="checkbox" {...register(presentPath)} />
        <span>
          {label}
          {score && <b className={styles.eyesPoint}> [1 балл]</b>}
        </span>
      </label>

      {selected && (
        <div className={styles.eyesInlineSide}>
          <EyeSidePicker name={sidePath} />
        </div>
      )}
    </div>
  );
};

/** Операция: собственная дата и собственный выбор глаза. */
const SurgeryItem: React.FC<{
  surgeryKey: SurgeryKey;
  label: string;
}> = ({ surgeryKey, label }) => {
  const { register, watch, setValue } = useFormContext<AnamnesisFormData>();

  const base = `eyes.surgeries.${surgeryKey}` as const;

  const selected = watch(`${base}.selected`) === true;

  return (
    <div className={styles.eyesSymptomItem}>
      <label
        className={`${styles.eyesCheckboxCard} ${
          selected ? styles.eyesCheckboxSelected : ""
        }`}
      >
        <input type="checkbox" {...register(`${base}.selected`)} />
        <span>{label}</span>
      </label>

      {selected && (
        <div className={styles.eyesSurgeryDetails}>
          <div className={styles.eyesDateField}>
            <DateField
              label="Дата проведения"
              name={`${base}.date`}
              watch={watch}
              setValue={setValue}
              placeholder="дд.мм.гггг"
            />
          </div>

          <EyeSidePicker name={`${base}.eye`} />
        </div>
      )}
    </div>
  );
};

export const EyesTab: React.FC = () => {
  const { register, watch, setValue } = useFormContext<AnamnesisFormData>();

  const [showCasDetails, setShowCasDetails] = useState(false);

  const acuityDecline = boolFromString(watch("eyes.decreasedVisualAcuity"));

  const cataract = boolFromString(watch("eyes.cataract"));
  const glaucoma = boolFromString(watch("eyes.glaucoma"));

  const showInitialDetails =
    acuityDecline === true || cataract === true || glaucoma === true;

  const deteriorationDate = watch("eyes.deteriorationDate");

  const ageAtDeterioration = getAgeAtDate(
    watch("birthDate"),
    deteriorationDate,
  );

  const diagnosis = watch("primaryExam.suspectedDiagnosis");

  const hasDiabetes = diagnosis === "type1" || diagnosis === "type2";

  const smoking = boolFromString(watch("lifestyle.smoking"));

  const course = watch("eyes.deteriorationCourse");

  const colorDistortion =
    watch("eyes.visualPhenomena.colorDistortion") === true;

  const diplopia = boolFromString(watch("eyes.diplopia"));

  const peripheralVisionTest = boolFromString(
    watch("eyes.peripheralVisionTest"),
  );

  const eyeDrops = boolFromString(watch("eyes.eyeDrops"));

  const eop = boolFromString(watch("eyes.endocrineOphthalmopathy"));

  const movementImpairment = boolFromString(watch("eyes.movementImpairment"));

  const eopDiplopia = boolFromString(watch("eyes.eopDiplopia"));

  const eopPtosis = boolFromString(watch("eyes.eopPtosis"));

  const ctOrbits = boolFromString(watch("eyes.ctOrbits"));

  const vesselInjection = watch("eyes.vesselInjection");

  const chemosis = boolFromString(watch("eyes.chemosis"));

  const eyelidEdema = watch("eyes.externalExam.eyelidEdema.present") === true;

  const caruncleInflammation =
    watch("eyes.externalExam.caruncleInflammation.present") === true;

  const periorbitalEdema = boolFromString(watch("eyes.periorbitalEdema"));

  const scleralInjection = boolFromString(watch("eyes.scleralInjection"));

  const upperRestriction = watch("eyes.movementDirections.up") === true;

  const lowerRestriction = watch("eyes.movementDirections.down") === true;

  /*
   * Шкала CAS: каждый из семи признаков
   * может дать максимум один балл.
   *
   * Повторяющиеся вопросы объединены:
   * например, отёк век и периорбитальный отёк
   * учитываются вместе, а не как два балла.
   */
  const casCriteria = [
    {
      label: "Спонтанная ретробульбарная боль",
      active: watch("eyes.cas.retrobulbarPain") === true,
    },
    {
      label: "Боль при взгляде вверх или вниз",
      active:
        watch("eyes.cas.gazePain") === true ||
        (movementImpairment === true && (upperRestriction || lowerRestriction)),
    },
    {
      label: "Покраснение век (эритема)",
      active: watch("eyes.cas.eyelidRedness") === true,
    },
    {
      label: "Инъекция конъюнктивы",
      active:
        vesselInjection === "conjunctival" ||
        vesselInjection === "mixed" ||
        scleralInjection === true,
    },
    {
      label: "Отёк век",
      active: eyelidEdema || periorbitalEdema === true,
    },
    {
      label: "Хемоз (отёк конъюнктивы)",
      active: chemosis === true,
    },
    {
      label: "Воспаление карункулы",
      active: caruncleInflammation,
    },
  ];

  const casScore = casCriteria.filter((item) => item.active).length;

  const updateEop = (checked: boolean) => {
    setValue("eyes.endocrineOphthalmopathy", checked, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className={`${styles.section} ${styles.eyesSection}`}>
      <h3>Глаза</h3>

      {/* ==================================
          1. Ранее добавленные глазные вопросы
          ================================== */}

      <YesNo
        label="Снижение остроты зрения"
        name="eyes.decreasedVisualAcuity"
        register={register}
      />

      {acuityDecline === true && (
        <>
          <div className={styles.eyesAcuityRow}>
            <fieldset className={styles.eyesSignGroup}>
              <legend>Знак</legend>

              <div className={styles.eyesSignOptions}>
                {(["+", "-"] as const).map((sign) => (
                  <label key={sign}>
                    <input
                      type="radio"
                      value={sign}
                      {...register("eyes.visualAcuitySign")}
                    />
                    {sign === "-" ? "−" : "+"}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={styles.eyesAcuityValue}>
              <Input
                label="Значение"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="0.5"
                {...register("eyes.visualAcuityValue", {
                  setValueAs: (value: unknown) =>
                    value === "" || value == null ? null : Number(value),
                })}
              />
            </div>
          </div>

          <EyeSidePicker
            name="eyes.decreasedVisualAcuityEye"
            label="Снижение остроты зрения — глаз"
          />
        </>
      )}

      <YesNo label="Катаракта" name="eyes.cataract" register={register} />

      {cataract === true && (
        <EyeSidePicker name="eyes.cataractEye" label="Катаракта — глаз" />
      )}

      <YesNo label="Глаукома" name="eyes.glaucoma" register={register} />

      {glaucoma === true && (
        <EyeSidePicker name="eyes.glaucomaEye" label="Глаукома — глаз" />
      )}

      {showInitialDetails && (
        <div className={styles.eyesDetails}>
          <div className={styles.eyesDateRow}>
            <div className={styles.eyesDateField}>
              <DateField
                label="Когда началось ухудшение зрения?"
                name="eyes.deteriorationDate"
                watch={watch}
                setValue={setValue}
              />
            </div>

            <span className={styles.eyesAgeInfo}>
              {ageAtDeterioration === null
                ? "Возраст начала ухудшения: не определён"
                : `Возраст начала ухудшения: ${ageAtDeterioration} лет`}
            </span>
          </div>

          {hasDiabetes && (
            <fieldset className={styles.eyesSideGroup}>
              <legend>Ухудшение зрения относительно диабета</legend>
              <div className={styles.eyesSideOptions}>
                <label>
                  <input
                    type="radio"
                    value="before"
                    {...register("eyes.relativeToDiabetes")}
                  />
                  До диабета
                </label>
                <label>
                  <input
                    type="radio"
                    value="after"
                    {...register("eyes.relativeToDiabetes")}
                  />
                  После диабета
                </label>
              </div>
            </fieldset>
          )}

          <div className={styles.radioGroup}>
            <label>Характер снижения</label>

            <label>
              <input
                type="radio"
                value="gradual"
                {...register("eyes.deteriorationCourse")}
              />
              Постепенно
            </label>

            <label>
              <input
                type="radio"
                value="sudden"
                {...register("eyes.deteriorationCourse")}
              />
              Внезапно
            </label>

            <label>
              <input
                type="radio"
                value="periodic"
                {...register("eyes.deteriorationCourse")}
              />
              Периодическое
            </label>
          </div>

          {course === "periodic" && (
            <fieldset className={styles.fieldset}>
              <legend>Условия периодического снижения зрения</legend>

              <div className={styles.eyesChoiceGrid}>
                {PERIODIC_TRIGGERS.map((item) => (
                  <label key={item.name}>
                    <input type="checkbox" {...register(item.name)} />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <YesNo
            label='Никталопия ("куриная слепота")'
            name="eyes.nyctalopia"
            register={register}
          />

          <YesNo
            label="Замедленная адаптация к темноте"
            name="eyes.delayedDarkAdaptation"
            register={register}
          />

          <YesNo
            label="Расплывчатость зрения"
            name="eyes.blurredVision"
            register={register}
          />

          <fieldset className={styles.fieldset}>
            <legend>Зрительные феномены</legend>

            <div className={styles.eyesChoiceGrid}>
              {VISUAL_PHENOMENA.map((item) => (
                <label key={item.name}>
                  <input type="checkbox" {...register(item.name)} />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            {colorDistortion && (
              <div className={styles.eyesColorField}>
                <Input
                  label="Какой цвет?"
                  placeholder="Укажите цвет"
                  {...register("eyes.colorDistortionDetails")}
                />
              </div>
            )}
          </fieldset>
        </div>
      )}

      {/* ==================================
          2. Прочие симптомы
          ================================== */}

      <fieldset className={styles.fieldset}>
        <legend>Прочие симптомы</legend>

        <div className={styles.eyesSymptomList}>
          {OTHER_SYMPTOMS.map((item) => (
            <SymptomWithSide
              key={item.key}
              name={`eyes.otherSymptoms.${item.key}`}
              label={item.label}
            />
          ))}
        </div>
      </fieldset>

      <YesNo label="Диплопия" name="eyes.diplopia" register={register} />

      {diplopia === true && (
        <div className={styles.eyesChoiceGrid}>
          <label>
            <input
              type="checkbox"
              {...register("eyes.diplopiaTypes.constant")}
            />
            <span>Постоянная</span>
          </label>

          <label>
            <input
              type="checkbox"
              {...register("eyes.diplopiaTypes.sideGaze")}
            />
            <span>При взгляде в стороны</span>
          </label>
        </div>
      )}

      {/* ==================================
          3. Внешний осмотр
          ================================== */}

      <fieldset className={styles.fieldset}>
        <legend>Внешний осмотр</legend>

        <div className={styles.eyesSymptomList}>
          {EXTERNAL_SIGNS.map((item) => (
            <SymptomWithSide
              key={item.key}
              name={`eyes.externalExam.${item.key}`}
              label={item.label}
              score={item.score}
            />
          ))}
        </div>
      </fieldset>

      {/* ==================================
          4. Инъекция сосудов
          ================================== */}

      <fieldset className={styles.fieldset}>
        <legend>Инъекция сосудов</legend>

        <div className={styles.eyesInjectionIllustration}>
          <img
            src={eyeInjectionImage}
            alt="Схема: конъюнктивальная, перикорнеальная, смешанная инъекция сосудов и норма"
          />
        </div>

        <p className={styles.eyesMuted}>Выберите один вариант по схеме.</p>

        <div className={styles.eyesInjectionOptions}>
          {INJECTION_TYPES.map((item) => (
            <label
              key={item.value}
              className={
                vesselInjection === item.value ? styles.eyesSelectedOption : ""
              }
            >
              <input
                type="radio"
                value={item.value}
                {...register("eyes.vesselInjection")}
              />

              <span>
                {item.label}
                {item.value === "conjunctival" && (
                  <b className={styles.eyesPoint}> [1 балл CAS]</b>
                )}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* ==================================
          5. Поля зрения
          ================================== */}

      <YesNo
        label="Выпадение боковых полей зрения?"
        name="eyes.visualFieldLoss"
        register={register}
      />

      <fieldset className={styles.fieldset}>
        <legend>Осмотр — определение периферического зрения</legend>

        <p className={styles.eyesMuted}>
          Проведение: попросить пациента следить глазами за карандашом, не
          поворачивая голову.
        </p>

        <YesNo
          label="Выявлены нарушения периферического зрения?"
          name="eyes.peripheralVisionTest"
          register={register}
        />

        {peripheralVisionTest === true && (
          <div className={styles.eyesSingleChoice}>
            {HEMIANOPIA_TYPES.map((item) => (
              <label key={item.value}>
                <input
                  type="radio"
                  value={item.value}
                  {...register("eyes.hemianopiaType")}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <YesNo
        label="Определение хемоза"
        name="eyes.chemosis"
        register={register}
      />

      {chemosis === true && (
        <p className={styles.eyesPointInfo}>Хемоз отмечен — 1 балл CAS.</p>
      )}

      {/* ==================================
          6. Наблюдение и лечение
          ================================== */}

      <Input
        label="Наблюдение у офтальмолога?"
        placeholder="Укажите сведения о наблюдении"
        {...register("eyes.ophthalmologistFollowUp")}
      />

      <YesNo
        label="Лекарственные глазные капли?"
        name="eyes.eyeDrops"
        register={register}
      />

      {eyeDrops === true && (
        <Input
          label="Какие глазные капли?"
          placeholder="Название, дозировка, кратность"
          {...register("eyes.eyeDropsDetails")}
        />
      )}

      <fieldset className={styles.fieldset}>
        <legend>Хирургическое лечение глаз</legend>

        <div className={styles.eyesSymptomList}>
          {SURGERIES.map((item) => (
            <SurgeryItem
              key={item.key}
              surgeryKey={item.key}
              label={item.label}
            />
          ))}
        </div>
      </fieldset>

      {/* ==================================
          7. Эндокринная офтальмопатия
          ================================== */}

      <div className={styles.eyesEopSection}>
        <div className={styles.eyesEopHeading}>
          <div className={styles.eyesEopTitle}>
            <strong>Эндокринная офтальмопатия</strong>

            {eop === true && smoking === true && (
              <span
                className={styles.eyesSmokingWarning}
                title="Курение — фактор риска"
                aria-label="Предупреждение: курение"
              >
                <span aria-hidden="true">⚠</span>
                <small>Курение</small>
              </span>
            )}
          </div>

          <label className={styles.eyesSwitch}>
            <input
              type="checkbox"
              role="switch"
              checked={eop === true}
              onChange={(event) => updateEop(event.target.checked)}
              aria-label="Эндокринная офтальмопатия"
            />
            <span className={styles.eyesSwitchTrack} />
            <span>{eop === true ? "Да" : "Нет"}</span>
          </label>
        </div>

        {eop === true && (
          <div className={styles.eyesEopContent}>
            <YesNo
              label="Экзофтальм"
              name="eyes.exophthalmos"
              register={register}
            />

            <YesNo
              label="Периорбитальный отёк"
              name="eyes.periorbitalEdema"
              register={register}
            />

            <YesNo
              label="Инъекция сосудов склер"
              name="eyes.scleralInjection"
              register={register}
            />

            <YesNo
              label="Ограничение подвижности, болезненность при движении"
              name="eyes.movementImpairment"
              register={register}
            />

            {movementImpairment === true && (
              <fieldset className={styles.fieldset}>
                <legend>Ограничение движения по направлениям</legend>

                <div className={styles.eyesChoiceGrid}>
                  {MOVEMENT_DIRECTIONS.map((item) => (
                    <label key={item.key}>
                      <input
                        type="checkbox"
                        {...register(`eyes.movementDirections.${item.key}`)}
                      />
                      <span>
                        {item.label}
                        {item.score && (
                          <b className={styles.eyesPoint}> [1 балл]</b>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <YesNo
              label="Диплопия при ЭОП"
              name="eyes.eopDiplopia"
              register={register}
            />

            {eopDiplopia === true && (
              <div className={styles.eyesChoiceGrid}>
                <label>
                  <input
                    type="checkbox"
                    {...register("eyes.eopDiplopiaTypes.constant")}
                  />
                  <span>Постоянная</span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    {...register("eyes.eopDiplopiaTypes.sideGaze")}
                  />
                  <span>При взгляде в стороны</span>
                </label>
              </div>
            )}

            <YesNo
              label="Птоз при ЭОП"
              name="eyes.eopPtosis"
              register={register}
            />

            {eopPtosis === true && (
              <section className={styles.eyesNamedSection}>
                <h4>Именные глазные симптомы</h4>

                <div className={styles.eyesTableScroll}>
                  <table className={styles.eyesNamedTable}>
                    <thead>
                      <tr>
                        <th scope="col">Симптом / синдром</th>
                        <th scope="col">Проявление</th>
                        <th scope="col">Есть</th>
                      </tr>
                    </thead>

                    <tbody>
                      {NAMED_SIGNS.map((item) => (
                        <tr key={item.key}>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td className={styles.eyesTableCheck}>
                            <input
                              type="checkbox"
                              aria-label={item.name}
                              {...register(`eyes.namedSigns.${item.key}`)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ==================================
                8. CAS — активность ЭОП
                ================================== */}

            <div className={styles.eyesCasSection}>
              <div className={styles.eyesCasHeader}>
                <div>
                  <strong>Шкала активности CAS</strong>

                  <div className={styles.eyesCasScore}>
                    <span>{casScore} / 7 баллов</span>

                    <span
                      className={
                        casScore >= 3
                          ? styles.eyesCasActive
                          : styles.eyesCasInactive
                      }
                    >
                      {casScore >= 3
                        ? "Активная стадия"
                        : "Неактивная стадия по CAS"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.eyesCasToggle}
                  onClick={() => setShowCasDetails((previous) => !previous)}
                  aria-expanded={showCasDetails}
                  aria-label={
                    showCasDetails
                      ? "Скрыть критерии CAS"
                      : "Показать критерии CAS"
                  }
                  title={
                    showCasDetails ? "Скрыть критерии" : "Показать критерии"
                  }
                >
                  <img
                    src={showCasDetails ? crossedEyeIcon : normalEyeIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              </div>

              {showCasDetails && (
                <div className={styles.eyesCasDetails}>
                  <p className={styles.eyesMuted}>
                    Каждый критерий учитывается один раз. Для первых трёх
                    признаков предусмотрен отдельный ввод; остальные
                    определяются по заполненным полям осмотра.
                  </p>

                  <div className={styles.eyesChoiceGrid}>
                    <label>
                      <input
                        type="checkbox"
                        {...register("eyes.cas.retrobulbarPain")}
                      />
                      <span>1. Спонтанная ретробульбарная боль</span>
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        {...register("eyes.cas.gazePain")}
                      />
                      <span>2. Боль при взгляде вверх или вниз</span>
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        {...register("eyes.cas.eyelidRedness")}
                      />
                      <span>3. Покраснение век (эритема)</span>
                    </label>
                  </div>

                  <div className={styles.eyesCasCriteriaList}>
                    {casCriteria.map((criterion, index) => (
                      <div
                        key={criterion.label}
                        className={styles.eyesCasCriterion}
                      >
                        <span
                          className={
                            criterion.active
                              ? styles.eyesCriterionPresent
                              : styles.eyesCriterionAbsent
                          }
                        >
                          {criterion.active ? "✓" : "○"}
                        </span>

                        <span>
                          {index + 1}. {criterion.label}
                        </span>

                        <strong>{criterion.active ? "+1" : "0"}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className={styles.eyesMuted}>
                CAS 0–2: неактивная стадия; CAS ≥3: активная стадия. Оценка
                требует подтверждения при клиническом осмотре.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ==================================
          9. КТ орбит
          ================================== */}

      <YesNo
        label="Имеется ли КТ орбит?"
        name="eyes.ctOrbits"
        register={register}
      />

      {ctOrbits === true && (
        <div className={styles.radioGroup}>
          <label>Место проведения КТ орбит</label>

          <label>
            <input
              type="radio"
              value="public"
              {...register("eyes.ctOrbitsPlace")}
            />
            Госучреждение
          </label>

          <label>
            <input
              type="radio"
              value="private"
              {...register("eyes.ctOrbitsPlace")}
            />
            Платное учреждение
          </label>
        </div>
      )}
    </div>
  );
};
