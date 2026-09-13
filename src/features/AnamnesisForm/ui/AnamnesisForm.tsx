import React, { useState, useEffect, useRef } from "react";
import {
  useFieldArray,
  type Control,
  type FieldArrayPath,
  type Path,
  type UseFormRegister,
  type UseFormWatch,
} from "react-hook-form";
import { useAnamnesisForm } from "../model/useAnamnesisForm";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Button } from "@/shared/ui/Button";
import type { AnamnesisFormData } from "@/shared";
import styles from "./styles.module.scss";

interface AnamnesisFormProps {
  patientId: string;
  initialData?: AnamnesisFormData;
  anamnesisId?: string;
  onSuccess?: () => void;
}

// ===== Типы вкладок =====
type TabId =
  | "primary"
  | "therapy"
  | "hypoglycemia"
  | "selfMonitoring"
  | "complications"
  | "examination"
  | "lifestyle"
  | "measurements"
  | "secondaryAH"
  | "heartFailure"
  | "h2fpef"
  | "additional";

const tabs: { id: TabId; label: string }[] = [
  { id: "primary", label: "Первичный осмотр" },
  { id: "therapy", label: "Терапия" },
  { id: "hypoglycemia", label: "Гипогликемии" },
  { id: "selfMonitoring", label: "Самоконтроль" },
  { id: "complications", label: "Осложнения" },
  { id: "examination", label: "Осмотр / анамнез" },
  { id: "lifestyle", label: "Образ жизни" },
  { id: "measurements", label: "Измерения" },
  { id: "secondaryAH", label: "Вторичные АГ" },
  { id: "heartFailure", label: "ХСН" },
  { id: "h2fpef", label: "H2FPEF" },
  { id: "additional", label: "Доп. анамнез" },
];

// ===== Обёртка с иконкой-подсказкой справа в поле =====
interface HintedFieldProps {
  hint?: string;
  children: React.ReactNode;
}

const HintedField: React.FC<HintedFieldProps> = ({ hint, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!hint) return <>{children}</>;

  return (
    <div className={styles.hintedField} ref={ref}>
      {children}
      <button
        type="button"
        className={styles.fieldHint}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Показать подсказку"
        aria-expanded={open}
      >
        ?
      </button>
      {open && (
        <div className={styles.hintPopover} role="tooltip">
          {hint}
        </div>
      )}
    </div>
  );
};

// ===== Поле "Примечание" =====
interface NoteFieldProps {
  noteKey: string;
  register: UseFormRegister<AnamnesisFormData>;
  watch: UseFormWatch<AnamnesisFormData>;
  label?: string;
  title?: string;
}

const NoteField: React.FC<NoteFieldProps> = ({
  noteKey,
  register,
  watch,
  label = "Примечание",
  title = "Введите примечание…",
}) => {
  const [open, setOpen] = useState(false);
  const path = `notes.${noteKey}` as Path<AnamnesisFormData>;
  const value = watch(path) as string | undefined;
  const visible = open || Boolean(value);

  return (
    <div className={styles.noteField}>
      {!visible ? (
        <button
          type="button"
          className={styles.noteToggle}
          onClick={() => setOpen(true)}
          title="Добавить примечание"
          aria-label="Добавить примечание"
        >
          +
        </button>
      ) : (
        <HintedField hint={title}>
          <Textarea label={label} {...register(path)} rows={2} />
        </HintedField>
      )}
    </div>
  );
};

// Вспомогательный компонент: подсказка рядом с label
const Hint: React.FC<{ text: string }> = ({ text }) => (
  <span className={styles.hint} title={text}>
    ❓
  </span>
);

// Преобразование строки radio в boolean
const boolFromString = (v: unknown): boolean | null => {
  if (v === true || v === "true") return true;
  if (v === false || v === "false") return false;
  return null;
};

// Вспомогательный компонент: да/нет радио
interface YesNoProps {
  label: string;
  hint?: string;
  name: Path<AnamnesisFormData>;
  register: UseFormRegister<AnamnesisFormData>;
}

const YesNo: React.FC<YesNoProps> = ({ label, hint, name, register }) => (
  <div className={styles.radioGroup}>
    <label>
      {label} {hint && <Hint text={hint} />}
    </label>
    <label>
      <input
        type="radio"
        value="true"
        {...register(name, { setValueAs: boolFromString })}
      />{" "}
      Да
    </label>
    <label>
      <input
        type="radio"
        value="false"
        {...register(name, { setValueAs: boolFromString })}
      />{" "}
      Нет
    </label>
  </div>
);

// ===== Список препаратов (Название + Доза) =====
type DrugArrayPath =
  | "type1Diabetes.initialTherapy"
  | "therapy.currentDrugs"
  | "therapy.basalInsulin"
  | "therapy.prandialInsulin"
  | "actualTherapy.basalInsulin"
  | "actualTherapy.bolusInsulin";

interface DrugListProps {
  control: Control<AnamnesisFormData>;
  register: UseFormRegister<AnamnesisFormData>;
  name: DrugArrayPath;
  firstField: "drugName" | "name";
  nameLabel?: string;
}

const DrugList: React.FC<DrugListProps> = ({
  control,
  register,
  name,
  firstField,
  nameLabel = "Название",
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as FieldArrayPath<AnamnesisFormData>,
  });

  const addRow = () => {
    if (firstField === "drugName") {
      append({ drugName: "", dose: "" } as never);
    } else {
      append({ name: "", dose: "" } as never);
    }
  };

  return (
    <div className={styles.drugList}>
      {fields.map((field, index) => {
        const firstPath =
          `${name}.${index}.${firstField}` as Path<AnamnesisFormData>;
        const dosePath = `${name}.${index}.dose` as Path<AnamnesisFormData>;
        return (
          <div key={field.id} className={styles.drugRow}>
            <Input label={nameLabel} {...register(firstPath)} />
            <Input label="Доза" {...register(dosePath)} />
            {fields.length > 1 && (
              <button
                type="button"
                className={styles.removeDrugButton}
                onClick={() => remove(index)}
                title="Удалить препарат"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
      <button type="button" className={styles.addDrugButton} onClick={addRow}>
        + Добавить препарат
      </button>
    </div>
  );
};

export const AnamnesisForm: React.FC<AnamnesisFormProps> = ({
  patientId,
  initialData,
  anamnesisId,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("primary");
  const { register, handleSubmit, errors, watch, setValue, control } =
    useAnamnesisForm({
      patientId,
      initialData,
      anamnesisId,
      onSuccess,
    });

  const suspectedDiagnosis = watch("primaryExam.suspectedDiagnosis");
  const isType1 = suspectedDiagnosis === "type1";
  const isType2 = suspectedDiagnosis === "type2";
  const type1Data = watch("type1Diabetes");
  const type2Data = watch("type2Diabetes");

  // Аутоантитела
  const autoantibodiesTested = boolFromString(
    watch("type1Diabetes.autoantibodies.tested"),
  );
  const gadChecked = watch("type1Diabetes.autoantibodies.GAD");
  const ia2Checked = watch("type1Diabetes.autoantibodies.IA2");
  const znt8Checked = watch("type1Diabetes.autoantibodies.ZnT8");
  const iaaChecked = watch("type1Diabetes.autoantibodies.IAA");

  // При выборе типа СД инициализируем соответствующий объект
  useEffect(() => {
    if (isType1 && !type1Data) {
      setValue("type1Diabetes", {
        ageAtDiagnosis: null,
        diagnosisDate: "",
        yearOfDiagnosis: "",
        howDiagnosed: "",
        howDiagnosedDetails: "",
        circumstances: "",
        glycemiaAtOnset: null,
        classicSymptoms: {
          polyuria: false,
          polydipsia: false,
          weakness: false,
          weightLoss: false,
          weightLossAmount: null,
          weightLossUnknown: false,
          nausea: false,
          vomiting: false,
          abdominalPain: false,
          visionBlur: false,
          lossOfConsciousness: false,
        },
        furtherPlan: "",
        initialTherapy: [{ drugName: "", dose: "" }],
        stillTakingInitialTherapy: null,
        ifNotTakingReason: "",
        autoantibodies: {
          tested: null,
          GAD: false,
          GADValue: null,
          IA2: false,
          IA2Value: null,
          ZnT8: false,
          ZnT8Value: null,
          IAA: false,
          IAAValue: null,
        },
        cPeptide: { value: "", date: "" },
        hba1c: { value: null, date: "" },
        usualGlucose: null,
        investigatedAfterDetection: null,
        initiallyType2: null,
      });
    }
    if (isType2 && !type2Data) {
      setValue("type2Diabetes", {
        height: null,
        weight: null,
        bmi: null,
        waistCircumference: null,
        weightChange6Months: null,
        weightIncreasedBy: null,
        weightDecreasedBy: null,
        firstGlucoseElevationYear: "",
        maxGlucoseValues: "",
        ageAtDiagnosis: null,
        yearOfDiagnosis: "",
        howDiagnosed: "",
        classicSymptoms: {
          polyuria: false,
          polydipsia: false,
          weakness: false,
          weightLoss: false,
          weightLossAmount: null,
          weightLossUnknown: false,
          visionBlur: false,
        },
        investigatedAfterDetection: null,
        initialTherapy: [{ drugName: "", dose: "", frequency: "" }],
        stillTakingInitialTherapy: null,
        ifNotTakingReason: "",
        currentTherapy: [{ drugName: "", dose: "", frequency: "" }],
        therapyRegularity: null,
        missedDosesPerWeek: "",
        missedReasons: "",
        usualGlucoseOnTherapy: null,
        hba1c: { value: null, date: "", unknown: false },
        gestationalDiabetes: null,
      });
    }
  }, [isType1, isType2, type1Data, type2Data, setValue]);

  const renderTab = () => {
    switch (activeTab) {
      case "primary":
        return (
          <>
            <HintedField hint="Что вас к нам привело? С какими жалобами поступили?">
              <Textarea
                label="Причина обращения"
                {...register("primaryExam.reason")}
                error={errors.primaryExam?.reason?.message}
                rows={3}
              />
            </HintedField>
            <NoteField
              noteKey="primaryExam.reason"
              register={register}
              watch={watch}
            />

            {/* ===== NEW — Антропометрия в начале формы ===== */}
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
                <Input
                  label="ИМТ (авторасчёт)"
                  type="number"
                  step="0.1"
                  suffix="кг/м²"
                  {...register("primaryExam.bmi")}
                  readOnly
                />
              </div>
              <Input
                label="Окружность талии"
                type="number"
                suffix="см"
                {...register("primaryExam.waistCircumference")}
              />
              <YesNo
                label="Изменился ли вес за последние 6 месяцев?"
                name="primaryExam.weightChange6Months"
                register={register}
              />
              {watch("primaryExam.weightChange6Months") === true && (
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
              )}
              <NoteField
                noteKey="primaryExam.anthropometry"
                register={register}
                watch={watch}
                label="Примечание по антропометрии"
              />
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
                    label="Возраст постановки диагноза"
                    type="number"
                    suffix="лет"
                    {...register("type1Diabetes.ageAtDiagnosis")}
                  />
                  <Input
                    label="Дата постановки"
                    type="date"
                    {...register("type1Diabetes.diagnosisDate")}
                  />
                </div>

                <Input
                  label="Год постановки диагноза"
                  {...register("type1Diabetes.yearOfDiagnosis")}
                />

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
                <NoteField
                  noteKey="type1Diabetes.howDiagnosed"
                  register={register}
                  watch={watch}
                />

                <Textarea
                  label="Детали (если нужно уточнить)"
                  {...register("type1Diabetes.howDiagnosedDetails")}
                  rows={2}
                />

                <HintedField hint="Что послужило триггерным фактором?">
                  <Textarea
                    label="При каких обстоятельствах?"
                    {...register("type1Diabetes.circumstances")}
                    rows={2}
                  />
                </HintedField>
                <NoteField
                  noteKey="type1Diabetes.circumstances"
                  register={register}
                  watch={watch}
                />

                <Input
                  label="Уровень гликемии в дебюте"
                  type="number"
                  step="0.1"
                  suffix="ммоль/л"
                  {...register("type1Diabetes.glycemiaAtOnset")}
                />

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
                  {watch("type1Diabetes.classicSymptoms.weightLoss") && (
                    <>
                      <Input
                        label="Потеря веса"
                        type="number"
                        suffix="кг"
                        {...register(
                          "type1Diabetes.classicSymptoms.weightLossAmount",
                        )}
                      />
                      <label>
                        <input
                          type="checkbox"
                          {...register(
                            "type1Diabetes.classicSymptoms.weightLossUnknown",
                          )}
                        />{" "}
                        Затрудняюсь сказать
                      </label>
                    </>
                  )}
                  {/* NEW — расширенные симптомы */}
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
                      {...register(
                        "type1Diabetes.classicSymptoms.abdominalPain",
                      )}
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
                  <NoteField
                    noteKey="type1Diabetes.classicSymptoms"
                    register={register}
                    watch={watch}
                  />
                </fieldset>

                <HintedField hint="Вы обратились к эндокринологу после обнаружения повышенного результата?">
                  <Textarea
                    label="План дальнейшего обследования"
                    {...register("type1Diabetes.furtherPlan")}
                    rows={2}
                  />
                </HintedField>
                <NoteField
                  noteKey="type1Diabetes.furtherPlan"
                  register={register}
                  watch={watch}
                />

                {/* NEW */}
                <YesNo
                  label="Вы обратились к эндокринологу после обнаружения повышенного результата?"
                  name="type1Diabetes.investigatedAfterDetection"
                  register={register}
                />
                <YesNo
                  label="Первично поставлен СД 2 типа?"
                  name="type1Diabetes.initiallyType2"
                  register={register}
                />

                <fieldset className={styles.fieldset}>
                  <legend>Терапия в дебюте</legend>
                  <DrugList
                    control={control}
                    register={register}
                    name="type1Diabetes.initialTherapy"
                    firstField="drugName"
                    nameLabel="Название препарата"
                  />
                  <NoteField
                    noteKey="type1Diabetes.initialTherapy"
                    register={register}
                    watch={watch}
                  />
                </fieldset>

                <YesNo
                  label="Данную терапию принимаете до сих пор?"
                  name="type1Diabetes.stillTakingInitialTherapy"
                  register={register}
                />
                {watch("type1Diabetes.stillTakingInitialTherapy") === false && (
                  <>
                    <Textarea
                      label="Что изменилось?"
                      {...register("type1Diabetes.ifNotTakingReason")}
                      rows={2}
                    />
                    <NoteField
                      noteKey="type1Diabetes.ifNotTakingReason"
                      register={register}
                      watch={watch}
                    />
                  </>
                )}

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
                          {...register(
                            "type1Diabetes.autoantibodies.ZnT8Value",
                          )}
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

                      <NoteField
                        noteKey="type1Diabetes.autoantibodies"
                        register={register}
                        watch={watch}
                      />
                    </>
                  )}
                </fieldset>

                <fieldset className={styles.fieldset}>
                  <legend>C-пептид</legend>
                  <Input
                    label="Значение"
                    suffix="нг/мл"
                    {...register("type1Diabetes.cPeptide.value")}
                  />
                  <Input
                    label="Дата"
                    type="date"
                    {...register("type1Diabetes.cPeptide.date")}
                  />
                  <NoteField
                    noteKey="type1Diabetes.cPeptide"
                    register={register}
                    watch={watch}
                  />
                </fieldset>

                <fieldset className={styles.fieldset}>
                  <legend>Гликированный гемоглобин</legend>
                  <Input
                    label="Значение"
                    type="number"
                    step="0.1"
                    suffix="%"
                    {...register("type1Diabetes.hba1c.value")}
                  />
                  <Input
                    label="Дата"
                    type="date"
                    {...register("type1Diabetes.hba1c.date")}
                  />
                  <NoteField
                    noteKey="type1Diabetes.hba1c"
                    register={register}
                    watch={watch}
                  />
                </fieldset>

                <Input
                  label="Привычные цифры глюкозы сейчас"
                  type="number"
                  step="0.1"
                  suffix="ммоль/л"
                  {...register("type1Diabetes.usualGlucose")}
                />
              </div>
            )}

            {/* ======================= СД 2 типа ======================= */}
            {isType2 && type2Data && (
              <div className={styles.section}>
                <h3>СД 2 типа — антропометрия и дебют</h3>

                <div className={styles.row}>
                  <Input
                    label="Рост"
                    type="number"
                    suffix="см"
                    {...register("type2Diabetes.height")}
                  />
                  <Input
                    label="Вес"
                    type="number"
                    step="0.1"
                    suffix="кг"
                    {...register("type2Diabetes.weight")}
                  />
                  <Input
                    label="ИМТ"
                    type="number"
                    step="0.1"
                    suffix="кг/м²"
                    {...register("type2Diabetes.bmi")}
                    readOnly
                  />
                </div>

                <Input
                  label="Окружность талии"
                  type="number"
                  suffix="см"
                  {...register("type2Diabetes.waistCircumference")}
                />

                <YesNo
                  label="Изменился ли вес за последние 6 месяцев?"
                  name="type2Diabetes.weightChange6Months"
                  register={register}
                />
                {watch("type2Diabetes.weightChange6Months") === true && (
                  <div className={styles.row}>
                    <Input
                      label="Увеличился на"
                      type="number"
                      suffix="кг"
                      {...register("type2Diabetes.weightIncreasedBy")}
                    />
                    <Input
                      label="Уменьшился на"
                      type="number"
                      suffix="кг"
                      {...register("type2Diabetes.weightDecreasedBy")}
                    />
                  </div>
                )}

                <Input
                  label="Когда впервые замечено повышение глюкозы? (год)"
                  {...register("type2Diabetes.firstGlucoseElevationYear")}
                />

                {/* NEW — дебют СД2 */}
                <div className={styles.row}>
                  <Input
                    label="Возраст постановки диагноза"
                    type="number"
                    suffix="лет"
                    {...register("type2Diabetes.ageAtDiagnosis")}
                  />
                  <Input
                    label="Год постановки диагноза"
                    {...register("type2Diabetes.yearOfDiagnosis")}
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
                  {watch("type2Diabetes.classicSymptoms.weightLoss") && (
                    <>
                      <Input
                        label="Потеря веса"
                        type="number"
                        suffix="кг"
                        {...register(
                          "type2Diabetes.classicSymptoms.weightLossAmount",
                        )}
                      />
                      <label>
                        <input
                          type="checkbox"
                          {...register(
                            "type2Diabetes.classicSymptoms.weightLossUnknown",
                          )}
                        />{" "}
                        Затрудняюсь сказать
                      </label>
                    </>
                  )}
                  <label>
                    <input
                      type="checkbox"
                      {...register("type2Diabetes.classicSymptoms.visionBlur")}
                    />{" "}
                    Нечёткость зрения
                  </label>
                </fieldset>

                <Textarea
                  label="Максимально зафиксированные значения глюкозы"
                  {...register("type2Diabetes.maxGlucoseValues")}
                  rows={2}
                />
                <NoteField
                  noteKey="type2Diabetes.maxGlucoseValues"
                  register={register}
                  watch={watch}
                />

                <YesNo
                  label="Вы обратились к эндокринологу после обнаружения повышенного результата?"
                  name="type2Diabetes.investigatedAfterDetection"
                  register={register}
                />

                <fieldset className={styles.fieldset}>
                  <legend>Терапия в дебюте</legend>
                  <Textarea
                    label="Название препарата, доза, кратность применения (для множественной терапии — перечислить все)"
                    {...register("type2Diabetes.ifNotTakingReason")}
                    rows={3}
                  />
                </fieldset>

                <YesNo
                  label="Данную терапию принимаете до сих пор?"
                  name="type2Diabetes.stillTakingInitialTherapy"
                  register={register}
                />
                {watch("type2Diabetes.stillTakingInitialTherapy") === false && (
                  <Textarea
                    label="Причина коррекции терапии"
                    {...register("type2Diabetes.ifNotTakingReason")}
                    rows={2}
                  />
                )}

                <YesNo
                  label="Регулярно ли принимаете терапию?"
                  name="type2Diabetes.therapyRegularity"
                  register={register}
                />
                <Input
                  label="Сколько раз в неделю можете пропустить приём таблеток?"
                  {...register("type2Diabetes.missedDosesPerWeek")}
                />
                <Textarea
                  label="Что мешает принимать регулярно (побочные эффекты, стоимость, сложность схемы, забывчивость)"
                  {...register("type2Diabetes.missedReasons")}
                  rows={2}
                />
                <Input
                  label="Привычные цифры глюкозы на терапии"
                  type="number"
                  step="0.1"
                  suffix="ммоль/л"
                  {...register("type2Diabetes.usualGlucoseOnTherapy")}
                />

                <fieldset className={styles.fieldset}>
                  <legend>Гликированный гемоглобин</legend>
                  <Input
                    label="Значение"
                    type="number"
                    step="0.1"
                    suffix="%"
                    {...register("type2Diabetes.hba1c.value")}
                  />
                  <Input
                    label="Дата"
                    type="date"
                    {...register("type2Diabetes.hba1c.date")}
                  />
                  <label>
                    <input
                      type="checkbox"
                      {...register("type2Diabetes.hba1c.unknown")}
                    />{" "}
                    Затрудняюсь ответить
                  </label>
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

      case "therapy":
        return (
          <div className={styles.section}>
            <h3>Терапия</h3>

            {/* ===== NEW — Актуальная терапия ===== */}
            <fieldset className={styles.fieldset}>
              <legend>Актуальная терапия</legend>

              <YesNo
                label="Совпадает с терапией в дебюте?"
                name="actualTherapy.sameAsInitial"
                register={register}
              />

              {watch("actualTherapy.sameAsInitial") === false && (
                <>
                  <div className={styles.radioGroup}>
                    <label>Способ введения инсулина:</label>
                    <label>
                      <input
                        type="radio"
                        value="injections"
                        {...register("actualTherapy.injectionMethod")}
                      />{" "}
                      Многократные инъекции
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="pump"
                        {...register("actualTherapy.injectionMethod")}
                      />{" "}
                      Инсулиновая помпа
                    </label>
                  </div>

                  {watch("actualTherapy.injectionMethod") === "injections" && (
                    <div className={styles.radioGroup}>
                      <label>Устройство:</label>
                      <label>
                        <input
                          type="radio"
                          value="syringe"
                          {...register("actualTherapy.injectionsDevice")}
                        />{" "}
                        Шприц
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="pen"
                          {...register("actualTherapy.injectionsDevice")}
                        />{" "}
                        Ручка
                      </label>
                    </div>
                  )}

                  {watch("actualTherapy.injectionMethod") === "pump" && (
                    <Input
                      label="Модель помпы"
                      {...register("actualTherapy.pumpModel")}
                    />
                  )}

                  <fieldset className={styles.fieldset}>
                    <legend>Базальный инсулин</legend>
                    <DrugList
                      control={control}
                      register={register}
                      name="actualTherapy.basalInsulin"
                      firstField="name"
                    />
                  </fieldset>

                  <fieldset className={styles.fieldset}>
                    <legend>Болюсный инсулин</legend>
                    <DrugList
                      control={control}
                      register={register}
                      name="actualTherapy.bolusInsulin"
                      firstField="name"
                    />
                  </fieldset>

                  <div className={styles.radioGroup}>
                    <label>Коэффициент (по длительности СД):</label>
                    <label>
                      <input
                        type="radio"
                        value="0.5"
                        {...register("actualTherapy.insulinDoseCoefficient", {
                          setValueAs: (v) => (v === "" ? null : Number(v)),
                        })}
                      />{" "}
                      0.5 (&lt;5 лет)
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="0.7"
                        {...register("actualTherapy.insulinDoseCoefficient", {
                          setValueAs: (v) => (v === "" ? null : Number(v)),
                        })}
                      />{" "}
                      0.7 (5–10 лет)
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="0.9"
                        {...register("actualTherapy.insulinDoseCoefficient", {
                          setValueAs: (v) => (v === "" ? null : Number(v)),
                        })}
                      />{" "}
                      0.9 (&gt;10 лет)
                    </label>
                  </div>

                  <Input
                    label="Расчётная суточная доза инсулина (авторасчёт)"
                    readOnly
                    suffix="Ед"
                    {...register("actualTherapy.calculatedDailyInsulinDose")}
                  />

                  <Textarea
                    label="Другие сахаропонижающие препараты"
                    {...register("actualTherapy.otherGlucoseLoweringDrugs")}
                    rows={2}
                  />
                  <Textarea
                    label="Места инъекций"
                    {...register("actualTherapy.injectionSites")}
                    rows={2}
                  />
                  <YesNo
                    label="Наличие липогипертрофии"
                    name="actualTherapy.lipohypertrophy"
                    register={register}
                  />
                </>
              )}
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Сахаропонижающие препараты (кроме инсулина)</legend>
              <DrugList
                control={control}
                register={register}
                name="therapy.currentDrugs"
                firstField="name"
              />
              <NoteField
                noteKey="therapy.currentDrugs"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Базальный инсулин</legend>
              <DrugList
                control={control}
                register={register}
                name="therapy.basalInsulin"
                firstField="name"
              />
              <NoteField
                noteKey="therapy.basalInsulin"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Прандиальный (болюсный) инсулин</legend>
              <DrugList
                control={control}
                register={register}
                name="therapy.prandialInsulin"
                firstField="name"
              />
              <NoteField
                noteKey="therapy.prandialInsulin"
                register={register}
                watch={watch}
              />
            </fieldset>

            <YesNo
              label="Используется ли подсчёт углеводов?"
              name="therapy.carbCounting"
              register={register}
            />
            {watch("therapy.carbCounting") === true && (
              <Input
                label="Углеводный коэффициент"
                {...register("therapy.carbRatio")}
              />
            )}
            <Textarea
              label="Места инъекций"
              {...register("therapy.injectionSites")}
              rows={2}
            />
            <NoteField
              noteKey="therapy.injectionSites"
              register={register}
              watch={watch}
            />
            <YesNo
              label="Наличие липогипертрофии"
              name="therapy.lipohypertrophy"
              register={register}
            />
            <NoteField
              noteKey="therapy.general"
              register={register}
              watch={watch}
              label="Примечание по терапии"
            />
          </div>
        );

      case "hypoglycemia":
        return (
          <div className={styles.section}>
            <h3>Гипогликемии</h3>
            <Input
              label="Частота гипогликемий"
              type="number"
              suffix="эпиз./нед."
              {...register("hypoglycemia.frequencyPerWeek")}
            />
            <YesNo
              label="Были ли тяжёлые эпизоды?"
              name="hypoglycemia.severeEpisodes"
              register={register}
            />
            {watch("hypoglycemia.severeEpisodes") === true && (
              <>
                <Input
                  label="Количество"
                  type="number"
                  suffix="эпиз."
                  {...register("hypoglycemia.severeEpisodesCount")}
                />
                <Input
                  label="Когда (дата)"
                  {...register("hypoglycemia.severeEpisodesWhen")}
                />
                <Textarea
                  label="Клиника"
                  {...register("hypoglycemia.severeEpisodesClinic")}
                  rows={2}
                />
                <NoteField
                  noteKey="hypoglycemia.severeEpisodes"
                  register={register}
                  watch={watch}
                />
              </>
            )}
            <YesNo
              label="Сохранено ли распознавание гипогликемии?"
              name="hypoglycemia.awarenessPreserved"
              register={register}
            />

            {/* NEW — тяжесть */}
            <div className={styles.radioGroup}>
              <label>Тяжесть гипогликемий:</label>
              <label>
                <input
                  type="radio"
                  value="mild"
                  {...register("hypoglycemia.severity")}
                />{" "}
                Лёгкие
              </label>
              <label>
                <input
                  type="radio"
                  value="severe"
                  {...register("hypoglycemia.severity")}
                />{" "}
                Тяжёлые (требовали помощи)
              </label>
            </div>

            {/* NEW — симптомы */}
            <fieldset className={styles.fieldset}>
              <legend>Симптомы гипогликемии</legend>
              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.symptoms.hunger")}
                />{" "}
                Волчий голод
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.symptoms.tremor")}
                />{" "}
                Тремор
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.symptoms.sweating")}
                />{" "}
                Потливость (холодный пот)
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.symptoms.tachycardia")}
                />{" "}
                Тахикардия
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.symptoms.anxiety")}
                />{" "}
                Тревожность
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.symptoms.weakness")}
                />{" "}
                Слабость
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.symptoms.diplopia")}
                />{" "}
                Диплопия (двоение в глазах)
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.symptoms.headache")}
                />{" "}
                Головная боль
              </label>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Типичные провоцирующие факторы</legend>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "hypoglycemia.provokingFactors.physicalActivity",
                  )}
                />{" "}
                Физическая нагрузка
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.provokingFactors.missedMeal")}
                />{" "}
                Пропуск еды
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("hypoglycemia.provokingFactors.alcohol")}
                />{" "}
                Алкоголь
              </label>
              <NoteField
                noteKey="hypoglycemia.provokingFactors"
                register={register}
                watch={watch}
              />
            </fieldset>
            <YesNo
              label="Есть ли дома глюкагон?"
              name="hypoglycemia.hasGlucagon"
              register={register}
            />
            <YesNo
              label="Обучены ли близкие введению глюкагона?"
              name="hypoglycemia.familyTrained"
              register={register}
            />
            <YesNo
              label="Ночные гипогликемии"
              name="hypoglycemia.nocturnalHypoglycemia"
              register={register}
            />
            <NoteField
              noteKey="hypoglycemia.general"
              register={register}
              watch={watch}
              label="Примечание по гипогликемиям"
            />
          </div>
        );

      case "selfMonitoring":
        return (
          <div className={styles.section}>
            <h3>Самоконтроль</h3>
            <Textarea
              label="Как часто происходит самоконтроль глюкозы?"
              {...register("selfMonitoring.frequency")}
              rows={2}
            />
            <YesNo
              label="В одно и то же время?"
              name="selfMonitoring.sameTime"
              register={register}
            />
            {watch("selfMonitoring.sameTime") === false && (
              <Textarea
                label="Поясните"
                {...register("selfMonitoring.ifNotSameTimeReason")}
                rows={2}
              />
            )}
            <YesNo
              label="Ведение дневника"
              name="selfMonitoring.diary"
              register={register}
            />

            {/* NEW — для СД 1 */}
            <fieldset className={styles.fieldset}>
              <legend>Для СД 1 типа</legend>
              <Input
                label="Как часто меняете иглу (например, после каждой инъекции)"
                {...register("selfMonitoring.needleChangeFrequency")}
              />
              <Input
                label="Как часто меняете место инъекции"
                {...register("selfMonitoring.siteChangeFrequency")}
              />
              <Input
                label="Сколько см отступаете (не менее 1–2 см)"
                {...register("selfMonitoring.injectionSiteDistance")}
              />
            </fieldset>

            {/* NEW — для СД 1 и 2 */}
            <fieldset className={styles.fieldset}>
              <legend>Для СД 1 и 2 типа</legend>
              <YesNo
                label="Имеется ли глюкометр?"
                name="selfMonitoring.hasGlucometer"
                register={register}
              />
              {watch("selfMonitoring.hasGlucometer") === true && (
                <YesNo
                  label="Производилась ли калибровка?"
                  name="selfMonitoring.calibrationDone"
                  register={register}
                />
              )}
              <Input
                label="Когда последний раз были у врача на диспансеризации?"
                {...register("selfMonitoring.lastDoctorVisit")}
              />
              <label>
                <input
                  type="checkbox"
                  {...register("selfMonitoring.lastDoctorVisitUnknown")}
                />{" "}
                Затрудняюсь ответить
              </label>
            </fieldset>

            <NoteField
              noteKey="selfMonitoring.general"
              register={register}
              watch={watch}
              label="Примечание по самоконтролю"
            />
          </div>
        );

      case "complications":
        return (
          <div className={styles.section}>
            <h3>Осложнения</h3>

            <fieldset className={styles.fieldset}>
              <legend>👁 Глаза</legend>
              <YesNo
                label="Снижение зрения?"
                name="complications.eyes.visionLoss"
                register={register}
              />
              {watch("complications.eyes.visionLoss") === true && (
                <>
                  <Input
                    label="Когда началось снижение зрения?"
                    {...register("complications.eyes.visionLossStart")}
                  />
                  <Input
                    label="За какой промежуток времени (авторасчёт)"
                    {...register("complications.eyes.visionLossDuration")}
                    readOnly
                  />
                  <YesNo
                    label="Хорошо ли видите ночью?"
                    name="complications.eyes.nightVisionGood"
                    register={register}
                  />
                </>
              )}
              <Input
                label="Дата последнего осмотра глазного дна"
                type="date"
                {...register("complications.eyes.lastFundusExamDate")}
              />
              <label>
                <input
                  type="checkbox"
                  {...register("complications.eyes.lastFundusExamUnknown")}
                />{" "}
                Затрудняюсь ответить
              </label>

              {/* NEW — расширенный блок глаз */}
              <YesNo
                label="Никталопия («куриная слепота») — плохо видите ночью?"
                name="complications.eyes.nyctalopia"
                register={register}
              />
              <YesNo
                label="Замедленная адаптация к темноте?"
                name="complications.eyes.delayedDarkAdaptation"
                register={register}
              />
              <YesNo
                label="Появляются ли мушки/сетка перед глазами?"
                name="complications.eyes.floaters"
                register={register}
              />
              {watch("complications.eyes.floaters") === true && (
                <div className={styles.radioGroup}>
                  <label>При каких условиях?</label>
                  <label>
                    <input
                      type="radio"
                      value="bp"
                      {...register("complications.eyes.floatersWhen")}
                    />{" "}
                    Повышение АД
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="glucose"
                      {...register("complications.eyes.floatersWhen")}
                    />{" "}
                    Повышение глюкозы
                  </label>
                </div>
              )}
              <YesNo
                label="Выпадение боковых полей зрения (например, за рулём)?"
                name="complications.eyes.visualFieldLoss"
                register={register}
              />
              <Input
                label="Как часто наблюдаетесь у офтальмолога?"
                {...register("complications.eyes.ophthalmologistFrequency")}
              />
              <NoteField
                noteKey="complications.eyes"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>👃 Нос (в разработке)</legend>
              <YesNo
                label="Храп"
                name="complications.nose.snoring"
                register={register}
              />
              <NoteField
                noteKey="complications.nose"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>👂 Уши</legend>
              <YesNo
                label="Снижение слуха?"
                name="complications.ears.hearingLoss"
                register={register}
              />
              {watch("complications.ears.hearingLoss") === true && (
                <>
                  <Input
                    label="Когда началось снижение слуха?"
                    {...register("complications.ears.hearingLossStart")}
                  />
                  <Input
                    label="За какой промежуток времени"
                    {...register("complications.ears.hearingLossDuration")}
                  />
                </>
              )}
              <Input
                label="Дата последнего осмотра ЛОРа"
                type="date"
                {...register("complications.ears.lastEntExamDate")}
              />
              <NoteField
                noteKey="complications.ears"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>🫃 ЖКТ</legend>
              <YesNo
                label="Гастрит"
                name="complications.gastrointestinal.gastritis"
                register={register}
              />
              <YesNo
                label="Язвы"
                name="complications.gastrointestinal.ulcers"
                register={register}
              />
              <YesNo
                label="Боли в животе после еды?"
                name="complications.gastrointestinal.abdominalPainAfterEating"
                register={register}
              />
              {/* NEW — провоцирующие факторы болей */}
              <label>Провоцирующие факторы болей в животе:</label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "complications.gastrointestinal.painTriggerFatty",
                  )}
                />{" "}
                Жирная пища
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "complications.gastrointestinal.painTriggerAlcohol",
                  )}
                />{" "}
                Алкоголь
              </label>

              <Textarea
                label="Частота стула"
                {...register("complications.gastrointestinal.stoolFrequency")}
                rows={2}
              />
              <label>
                Оформленность кала (0 = диарея, 5 = норма, 10 = запор)
              </label>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                {...register("complications.gastrointestinal.stoolConsistency")}
                className={styles.slider}
              />
              <NoteField
                noteKey="complications.gastrointestinal"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>🚽 Мочевыделительная система</legend>
              <YesNo
                label="Камни в почках?"
                name="complications.urinary.kidneyStones"
                register={register}
              />
              <NoteField
                noteKey="complications.urinary"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>🫘 Нефропатия</legend>
              <Input
                label="Альбумин/креатинин мочи"
                {...register("complications.nephropathy.albuminCreatinine")}
              />
              <Input
                label="СКФ"
                {...register("complications.nephropathy.gfr")}
              />
              <NoteField
                noteKey="complications.nephropathy"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>🦶 Нейропатия (стопы)</legend>
              <label>Симптомы (множественный выбор):</label>
              <label>
                <input
                  type="checkbox"
                  {...register("complications.neuropathy.symptoms.numbness")}
                />{" "}
                Онемение
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("complications.neuropathy.symptoms.pain")}
                />{" "}
                Боль
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("complications.neuropathy.symptoms.paresthesia")}
                />{" "}
                Парестезии
              </label>

              {watch("complications.neuropathy.symptoms.numbness") && (
                <div className={styles.radioGroup}>
                  <label>Когда онемение?</label>
                  <label>
                    <input
                      type="radio"
                      value="day"
                      {...register("complications.neuropathy.numbnessTime")}
                    />{" "}
                    Днём
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="night"
                      {...register("complications.neuropathy.numbnessTime")}
                    />{" "}
                    Ночью
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="any"
                      {...register("complications.neuropathy.numbnessTime")}
                    />{" "}
                    Вне зависимости
                  </label>
                </div>
              )}

              <label>Тип парестезий:</label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "complications.neuropathy.paresthesiaType.crawling",
                  )}
                />{" "}
                Ползание мурашек
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "complications.neuropathy.paresthesiaType.shots",
                  )}
                />{" "}
                Прострелы
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "complications.neuropathy.paresthesiaType.allodynia",
                  )}
                />{" "}
                Аллодиния
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "complications.neuropathy.paresthesiaType.hyperalgesia",
                  )}
                />{" "}
                Гипералгезия
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "complications.neuropathy.paresthesiaType.nightCramps",
                  )}
                />{" "}
                Ночные судороги
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "complications.neuropathy.paresthesiaType.burning",
                  )}
                />{" "}
                Жжение
              </label>

              <YesNo
                label="Часто ли мёрзнут ноги?"
                name="complications.neuropathy.coldFeet"
                register={register}
              />
              {watch("complications.neuropathy.coldFeet") === true && (
                <>
                  <Textarea
                    label="Чем согреваете ноги?"
                    {...register("complications.neuropathy.howWarmFeet")}
                    rows={2}
                  />
                  <YesNo
                    label="Прислоняете ноги к батарее?"
                    name="complications.neuropathy.feetToRadiator"
                    register={register}
                  />
                </>
              )}
              <YesNo
                label="Были ли ампутации?"
                name="complications.neuropathy.amputations"
                register={register}
              />
              {watch("complications.neuropathy.amputations") === true && (
                <>
                  <Input
                    label="Уровень ампутации"
                    {...register("complications.neuropathy.amputationLevel")}
                  />
                  <Input
                    label="Дата"
                    type="date"
                    {...register("complications.neuropathy.amputationDate")}
                  />
                  <NoteField
                    noteKey="complications.neuropathy.amputations"
                    register={register}
                    watch={watch}
                  />
                </>
              )}

              <div className={styles.row}>
                <div>
                  <label>Кожа стоп</label>
                  <select {...register("complications.neuropathy.footSkin")}>
                    <option value="">—</option>
                    <option value="hyperkeratosis">Гиперкератоз</option>
                    <option value="dry">Сухая</option>
                    <option value="normal">Нормальная</option>
                    <option value="moist">Влажная</option>
                  </select>
                </div>
                <div>
                  <label>Степень гиперкератоза</label>
                  <select
                    {...register(
                      "complications.neuropathy.hyperkeratosisDegree",
                    )}
                  >
                    <option value="">—</option>
                    <option value="moderate">Умеренный</option>
                    <option value="severe">Сильно выраженный</option>
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>Температура</label>
                  <select
                    {...register("complications.neuropathy.footTemperature")}
                  >
                    <option value="">—</option>
                    <option value="cold">Холодная</option>
                    <option value="warm">Тёплая</option>
                    <option value="hot">Горячая</option>
                  </select>
                </div>
                <div>
                  <label>Цвет стоп</label>
                  <select {...register("complications.neuropathy.footColor")}>
                    <option value="">—</option>
                    <option value="cyanotic">Цианотичная</option>
                    <option value="pale">Бледная</option>
                    <option value="normal">Нормальная</option>
                    <option value="hyperemic">Гиперемированная</option>
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>Ногтевые пластины</label>
                  <select {...register("complications.neuropathy.nails")}>
                    <option value="">—</option>
                    <option value="normal">Норма</option>
                    <option value="onychohypertrophy">Онихогипертрофия</option>
                    <option value="onychodystrophy">Ониходистрофия</option>
                    <option value="onychomycosis">Онихомикоз</option>
                    <option value="subungualHematoma">
                      Подногтевая гематома
                    </option>
                    <option value="ingrownNail">Вросший ноготь</option>
                  </select>
                </div>
                <div>
                  <label>Деформация стоп</label>
                  <select
                    {...register("complications.neuropathy.footDeformity")}
                  >
                    <option value="">—</option>
                    <option value="none">Отсутствует</option>
                    <option value="flatfoot">Плоскостопие</option>
                    <option value="longitudinal">Продольное</option>
                    <option value="transverse">Поперечное</option>
                  </select>
                </div>
              </div>

              <label>Голени</label>
              <select {...register("complications.neuropathy.lowerLegs")}>
                <option value="">—</option>
                <option value="normal">Норма</option>
                <option value="hairLoss">Выпадение волос</option>
                <option value="hyperpigmentation">Гиперпигментация</option>
                <option value="spottedLegs">«Пятнистые голени»</option>
                <option value="muscleAtrophy">Атрофия мышц</option>
              </select>

              <YesNo
                label="Hallux valgus"
                name="complications.neuropathy.halluxValgus"
                register={register}
              />
              <YesNo
                label="Молоткообразная деформация"
                name="complications.neuropathy.hammerToe"
                register={register}
              />
              <YesNo
                label="Клювовидная деформация"
                name="complications.neuropathy.clawToe"
                register={register}
              />
              <YesNo
                label="Перекрещивание пальцев"
                name="complications.neuropathy.digitusSuperductus"
                register={register}
              />

              <NoteField
                noteKey="complications.neuropathy"
                register={register}
                watch={watch}
                label="Примечание по нейропатии"
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>
                Чувствительность (0 = норма, 1 = снижение, 2 = отсутствует)
              </legend>
              <div className={styles.table}>
                <div className={styles.tableRow}>
                  <span>Вид</span>
                  <span>Правая</span>
                  <span>Левая</span>
                </div>
                {(
                  [
                    "vibration",
                    "temperature",
                    "pain",
                    "tactile",
                    "jointMuscle",
                    "achillesReflex",
                    "kneeReflex",
                  ] as const
                ).map((key) => {
                  const rightName: Path<AnamnesisFormData> = `complications.neuropathy.sensitivity.${key}.right`;
                  const leftName: Path<AnamnesisFormData> = `complications.neuropathy.sensitivity.${key}.left`;

                  return (
                    <div key={key} className={styles.tableRow}>
                      <span>{key}</span>
                      <input
                        type="number"
                        min={0}
                        max={2}
                        {...register(rightName)}
                      />
                      <input
                        type="number"
                        min={0}
                        max={2}
                        {...register(leftName)}
                      />
                    </div>
                  );
                })}
              </div>
              <NoteField
                noteKey="complications.neuropathy.sensitivity"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Вены нижних конечностей</legend>
              <YesNo
                label="Лимфедема"
                name="complications.neuropathy.lymphedema"
                register={register}
              />
              <Textarea
                label="Симптом Ласега (детали)"
                {...register("complications.neuropathy.lasegueDetails")}
                rows={2}
              />
              <Textarea
                label="Осмотр стоп, наличие язв в анамнезе"
                {...register("complications.neuropathy.footExamNotes")}
                rows={3}
              />
              <Textarea
                label="Когда появилась рана?"
                {...register("complications.neuropathy.woundAppearance")}
                rows={2}
              />
              <NoteField
                noteKey="complications.neuropathy.veins"
                register={register}
                watch={watch}
                label="Примечание по венам / стопам"
              />
            </fieldset>
          </div>
        );

      case "examination":
        return (
          <div className={styles.section}>
            <h3>Осмотр / общий анамнез</h3>
            <Textarea
              label="Сердечно-сосудистые события (ИБС, инсульт), АД"
              {...register("examination.cardiovascularEvents")}
              rows={2}
            />
            <NoteField
              noteKey="examination.cardiovascularEvents"
              register={register}
              watch={watch}
            />
            <Textarea
              label="Другие хронические заболевания"
              {...register("examination.otherChronicDiseases")}
              rows={2}
            />
            <NoteField
              noteKey="examination.otherChronicDiseases"
              register={register}
              watch={watch}
            />
            <Textarea
              label="Все текущие лекарства и добавки"
              {...register("examination.currentMedications")}
              rows={2}
            />
            <NoteField
              noteKey="examination.currentMedications"
              register={register}
              watch={watch}
            />
            <Textarea
              label="Аллергия"
              {...register("examination.allergies")}
              rows={2}
            />
            <NoteField
              noteKey="examination.allergies"
              register={register}
              watch={watch}
            />
            <Textarea
              label="Госпитализации и операции"
              {...register("examination.hospitalizations")}
              rows={2}
            />
            <NoteField
              noteKey="examination.hospitalizations"
              register={register}
              watch={watch}
            />
            <Textarea
              label="Вакцинация"
              {...register("examination.vaccinations")}
              rows={2}
            />
            <NoteField
              noteKey="examination.vaccinations"
              register={register}
              watch={watch}
            />
            <YesNo
              label="Заболевания щитовидной железы (аутииммунный тиреоидит)"
              name="examination.thyroidDisease"
              register={register}
            />
            <YesNo
              label="Целиакия"
              name="examination.celiacDisease"
              register={register}
            />
            <Textarea
              label="Другие аутоиммунные состояния (витилиго, надпочечниковая недостаточность и др.)"
              {...register("examination.otherAutoimmune")}
              rows={2}
            />
            <NoteField
              noteKey="examination.otherAutoimmune"
              register={register}
              watch={watch}
            />
            <Textarea
              label="Семейный анамнез СД 1 типа или других аутоиммунных заболеваний (родственники 1-й линии)"
              {...register("examination.familyHistory")}
              rows={2}
            />
            <NoteField
              noteKey="examination.familyHistory"
              register={register}
              watch={watch}
            />

            <fieldset className={styles.fieldset}>
              <legend>Репродуктивный анамнез (при необходимости)</legend>
              <Input
                label="Беременность"
                type="number"
                {...register("examination.pregnancies")}
              />
              <Input
                label="Роды"
                type="number"
                {...register("examination.births")}
              />
              <Textarea
                label="Менструальный цикл"
                {...register("examination.menstrualCycle")}
                rows={2}
              />
              <NoteField
                noteKey="examination.reproductive"
                register={register}
                watch={watch}
              />
            </fieldset>
          </div>
        );

      case "lifestyle":
        return (
          <div className={styles.section}>
            <h3>Образ жизни</h3>
            <fieldset className={styles.fieldset}>
              <legend>Алкоголь</legend>
              <Textarea
                label="Как часто употребляете алкоголь?"
                {...register("lifestyle.alcoholFrequency")}
                rows={2}
              />
              <Input
                label="Тип (крепкий / вино / пиво и т.п.)"
                {...register("lifestyle.alcoholType")}
              />
              <NoteField
                noteKey="lifestyle.alcohol"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Курение</legend>
              <YesNo
                label="Курите?"
                name="lifestyle.smoking"
                register={register}
              />
              {watch("lifestyle.smoking") === true && (
                <>
                  <Input
                    label="С какого возраста?"
                    type="number"
                    suffix="лет"
                    {...register("lifestyle.smokingStartAge")}
                  />
                  <Input
                    label="Сколько сигарет в день?"
                    type="number"
                    suffix="шт."
                    {...register("lifestyle.cigarettesPerDay")}
                  />
                </>
              )}
              <NoteField
                noteKey="lifestyle.smoking"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Питание</legend>
              <YesNo
                label="Пищу подсаливаете?"
                name="lifestyle.saltFood"
                register={register}
              />
              <YesNo
                label="Много полуфабрикатов (колбаса, сосиски, копчёности, орешки, маринованные овощи, рыбные консервы, соевый соус, кетчуп)"
                name="lifestyle.processedFood"
                register={register}
              />
              <Input
                label="Сколько чашек кофе в день?"
                type="number"
                suffix="чаш."
                {...register("lifestyle.coffeeCupsPerDay")}
              />
              <YesNo
                label="Кофе крепкий?"
                name="lifestyle.strongCoffee"
                register={register}
              />
              <YesNo
                label="Энергетики"
                name="lifestyle.energyDrinks"
                register={register}
              />
              <NoteField
                noteKey="lifestyle.nutrition"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Работа и стресс</legend>
              <Input
                label="Кем работаете?"
                {...register("lifestyle.occupation")}
              />
              <YesNo
                label="Сидячая работа?"
                name="lifestyle.sedentaryWork"
                register={register}
              />
              <YesNo
                label="Много стресса?"
                name="lifestyle.stress"
                register={register}
              />
              <NoteField
                noteKey="lifestyle.work"
                register={register}
                watch={watch}
              />
            </fieldset>

            {/* ===== NEW — Хронические заболевания ===== */}
            <fieldset className={styles.fieldset}>
              <legend>Хронические заболевания</legend>
              <Textarea
                label="Заболевания глаз (кроме диабетических)"
                {...register("lifestyle.chronicEyeDiseases")}
                rows={2}
              />
              <YesNo
                label="Бронхиальная астма"
                name="lifestyle.asthma"
                register={register}
              />
              {watch("lifestyle.asthma") === true && (
                <>
                  <Input
                    label="Когда выявили?"
                    {...register("lifestyle.asthmaDiagnosedWhen")}
                  />
                  <Input
                    label="Аллерген"
                    {...register("lifestyle.asthmaAllergen")}
                  />
                </>
              )}
              <YesNo label="ХОБЛ" name="lifestyle.copd" register={register} />
              {watch("lifestyle.copd") === true && (
                <Input
                  label="Что принимаете при ХОБЛ"
                  {...register("lifestyle.copdMeds")}
                />
              )}
            </fieldset>

            {/* ===== NEW — ССС блок ===== */}
            <fieldset className={styles.fieldset}>
              <legend>Сердечно-сосудистая система / АД</legend>

              <div className={styles.radioGroup}>
                <label>Известно ли о повышенном АД?</label>
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
                <label>
                  <input
                    type="radio"
                    value="notMeasured"
                    {...register("lifestyle.knownHypertension")}
                  />{" "}
                  Не измерял
                </label>
              </div>

              {watch("lifestyle.knownHypertension") === "yes" && (
                <>
                  <Input
                    label="Когда впервые зафиксировано повышение АД (год или возраст)"
                    {...register("lifestyle.hypertensionFirstDetected")}
                  />
                  <label>
                    <input
                      type="checkbox"
                      {...register("lifestyle.hypertensionUnderAge35")}
                    />{" "}
                    Возраст &lt;35 лет (пометить)
                  </label>

                  <div className={styles.radioGroup}>
                    <label>Как было выявлено?</label>
                    <label>
                      <input
                        type="radio"
                        value="accidental"
                        {...register("lifestyle.hypertensionDetectionMethod")}
                      />{" "}
                      Случайно дома
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="dispanserization"
                        {...register("lifestyle.hypertensionDetectionMethod")}
                      />{" "}
                      Диспансеризация
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="withComplaints"
                        {...register("lifestyle.hypertensionDetectionMethod")}
                      />{" "}
                      При наличии жалоб
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="hospitalization"
                        {...register("lifestyle.hypertensionDetectionMethod")}
                      />{" "}
                      Во время госпитализации
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="ems"
                        {...register("lifestyle.hypertensionDetectionMethod")}
                      />{" "}
                      СМП
                    </label>
                  </div>

                  <YesNo
                    label="Обращались ли к врачу после обнаружения?"
                    name="lifestyle.visitedDoctorAfterDetection"
                    register={register}
                  />

                  <Textarea
                    label="Какую терапию назначил тогда врач (препарат, доза, кратность, время)"
                    {...register("lifestyle.prescribedTherapyThen")}
                    rows={3}
                  />

                  <YesNo
                    label="Терапию принимаете регулярно?"
                    name="lifestyle.therapyRegularity"
                    register={register}
                  />
                  <Input
                    label="Сколько раз в неделю можете пропустить приём таблеток?"
                    {...register("lifestyle.missedDosesPerWeek")}
                  />
                  <Textarea
                    label="Что мешает принимать регулярно (побочные, стоимость, сложность, забывчивость)"
                    {...register("lifestyle.missedReasons")}
                    rows={2}
                  />
                  <Input
                    label="Какое давление на принимаемой терапии?"
                    {...register("lifestyle.bpOnTherapy")}
                  />

                  <YesNo
                    label="Сохраняется ли повышенное давление при приёме ≥3 препаратов (включая мочегонное)?"
                    name="lifestyle.bpResistant3Drugs"
                    register={register}
                  />
                  <YesNo
                    label="Отменял ли самостоятельно?"
                    name="lifestyle.selfDiscontinued"
                    register={register}
                  />
                  <YesNo
                    label="Изменял ли врач терапию?"
                    name="lifestyle.doctorChangedTherapy"
                    register={register}
                  />
                  {watch("lifestyle.doctorChangedTherapy") === true && (
                    <Textarea
                      label="Как изменена терапия (препарат, доза, кратность, время)"
                      {...register("lifestyle.changedTherapyDetails")}
                      rows={3}
                    />
                  )}

                  <YesNo
                    label="Измеряете ли давление дома?"
                    name="lifestyle.measureAtHome"
                    register={register}
                  />
                  {watch("lifestyle.measureAtHome") === true && (
                    <>
                      <Input
                        label="Как часто измеряете?"
                        {...register("lifestyle.measureFrequency")}
                      />
                      <YesNo
                        label="Ведёте ли дневник?"
                        name="lifestyle.keepDiary"
                        register={register}
                      />
                    </>
                  )}

                  <Input
                    label="Максимальные зафиксированные цифры АД"
                    {...register("lifestyle.maxBPValues")}
                  />
                  <Textarea
                    label="Субъективные жалобы при повышении АД (боли в сердце, нарушения ритма, жар, головные боли, головокружение, тошнота, шум в ушах, мушки)"
                    {...register("lifestyle.subjectiveComplaints")}
                    rows={3}
                  />
                  <Textarea
                    label="При каком давлении и чем снижаете высокие подъёмы АД?"
                    {...register("lifestyle.atWhatBPReduced")}
                    rows={2}
                  />

                  <YesNo
                    label="Были ли кризы, требующие вызова скорой?"
                    name="lifestyle.hypertensiveCrisesAmbulance"
                    register={register}
                  />
                  {watch("lifestyle.hypertensiveCrisesAmbulance") === true && (
                    <>
                      <Input
                        label="Сколько раз?"
                        {...register("lifestyle.crisesCount")}
                      />
                      <Textarea
                        label="Сопровождались ли кризы симптомами? (головная боль, нарушение речи/зрения, слабость в конечностях, судороги, потеря сознания)"
                        {...register("lifestyle.crisesSymptoms")}
                        rows={3}
                      />
                    </>
                  )}

                  <YesNo
                    label="Ритм сердца правильный?"
                    name="lifestyle.heartRhythmRegular"
                    register={register}
                  />
                  <YesNo
                    label="Кардиостимуляторы?"
                    name="lifestyle.pacemakers"
                    register={register}
                  />
                  <YesNo
                    label="Мерцательная аритмия?"
                    name="lifestyle.atrialFibrillation"
                    register={register}
                  />
                </>
              )}
            </fieldset>
          </div>
        );

      case "measurements":
        return (
          <div className={styles.section}>
            <h3>Измерения</h3>
            <fieldset className={styles.fieldset}>
              <legend>Пульсоксиметр</legend>
              <div className={styles.row}>
                <Input
                  label="Левая рука"
                  type="number"
                  suffix="%"
                  {...register("measurements.pulseOximetry.leftHand")}
                />
                <Input
                  label="Правая рука"
                  type="number"
                  suffix="%"
                  {...register("measurements.pulseOximetry.rightHand")}
                />
              </div>
              <NoteField
                noteKey="measurements.pulseOximetry"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Пальпация пульса</legend>
              <div className={styles.radioGroup}>
                <label>На лучевой артерии — ритм:</label>
                <label>
                  <input
                    type="radio"
                    value="regular"
                    {...register(
                      "measurements.pulsePalpation.radialArtery.rhythm",
                    )}
                  />{" "}
                  Регулярный
                </label>
                <label>
                  <input
                    type="radio"
                    value="irregular"
                    {...register(
                      "measurements.pulsePalpation.radialArtery.rhythm",
                    )}
                  />{" "}
                  Нерегулярный
                </label>
              </div>
              <div className={styles.radioGroup}>
                <label>Симметричность:</label>
                <label>
                  <input
                    type="radio"
                    value="symmetric"
                    {...register(
                      "measurements.pulsePalpation.radialArtery.symmetry",
                    )}
                  />{" "}
                  Симметричный
                </label>
                <label>
                  <input
                    type="radio"
                    value="asymmetric"
                    {...register(
                      "measurements.pulsePalpation.radialArtery.symmetry",
                    )}
                  />{" "}
                  Несимметричный
                </label>
              </div>
              <YesNo
                label="Задняя большеберцовая артерия слева пальпируется?"
                name="measurements.pulsePalpation.posteriorTibialArtery.left"
                register={register}
              />
              <YesNo
                label="Задняя большеберцовая артерия справа пальпируется?"
                name="measurements.pulsePalpation.posteriorTibialArtery.right"
                register={register}
              />
              <YesNo
                label="Тыльная артерия стопы слева пальпируется?"
                name="measurements.pulsePalpation.dorsalisPedisArtery.left"
                register={register}
              />
              <YesNo
                label="Тыльная артерия стопы справа пальпируется?"
                name="measurements.pulsePalpation.dorsalisPedisArtery.right"
                register={register}
              />
              <NoteField
                noteKey="measurements.pulsePalpation"
                register={register}
                watch={watch}
              />
            </fieldset>

            <YesNo
              label="Условия выполнены (не принимали антигипертензивные за 2 ч, не курили за 1 ч, не пили чай/кофе/алкоголь за 1 ч)"
              name="measurements.conditionsMet"
              register={register}
            />

            <fieldset className={styles.fieldset}>
              <legend>АД на двух руках (мм рт. ст.)</legend>
              <div className={styles.row}>
                <Input
                  label="Левая — систолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpArms.leftSystolic")}
                />
                <Input
                  label="Левая — диастолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpArms.leftDiastolic")}
                />
              </div>
              <div className={styles.row}>
                <Input
                  label="Правая — систолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpArms.rightSystolic")}
                />
                <Input
                  label="Правая — диастолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpArms.rightDiastolic")}
                />
              </div>
              <Input
                label="Пульсовое давление (авторасчёт)"
                suffix="мм рт. ст."
                {...register("measurements.pulsePressure")}
                readOnly
              />
              <NoteField
                noteKey="measurements.bpArms"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>АД на двух ногах (мм рт. ст.)</legend>
              <div className={styles.row}>
                <Input
                  label="Левая — систолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpLegs.leftSystolic")}
                />
                <Input
                  label="Левая — диастолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpLegs.leftDiastolic")}
                />
              </div>
              <div className={styles.row}>
                <Input
                  label="Правая — систолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpLegs.rightSystolic")}
                />
                <Input
                  label="Правая — диастолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpLegs.rightDiastolic")}
                />
              </div>
              <div className={styles.row}>
                <Input
                  label="ЛПИ слева (авторасчёт)"
                  {...register("measurements.abiIndex.left")}
                  readOnly
                />
                <Input
                  label="ЛПИ справа (авторасчёт)"
                  {...register("measurements.abiIndex.right")}
                  readOnly
                />
              </div>
              <NoteField
                noteKey="measurements.bpLegs"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Боли при ходьбе / конечности</legend>
              <YesNo
                label="Боли при ходьбе в ногах/икрах"
                name="measurements.legPainWalking"
                register={register}
              />
              <YesNo
                label="Проходят ли боли после остановки?"
                name="measurements.painStopsAfterRest"
                register={register}
              />
              <Input
                label="Сколько можете пройти без остановки"
                {...register("measurements.walkingDistance")}
              />
              <Input
                label="Цвет конечностей"
                {...register("measurements.limbColor")}
              />
              <Input
                label="Температура"
                {...register("measurements.limbTemperature")}
              />
              <Input label="Кожа" {...register("measurements.limbSkin")} />
              <NoteField
                noteKey="measurements.limbs"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Повторное измерение АД</legend>
              <div className={styles.row}>
                <Input
                  label="Левая — систолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpRepeat.leftSystolic")}
                />
                <Input
                  label="Левая — диастолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpRepeat.leftDiastolic")}
                />
              </div>
              <div className={styles.row}>
                <Input
                  label="Правая — систолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpRepeat.rightSystolic")}
                />
                <Input
                  label="Правая — диастолическое"
                  type="number"
                  suffix="мм рт. ст."
                  {...register("measurements.bpRepeat.rightDiastolic")}
                />
              </div>
              <NoteField
                noteKey="measurements.bpRepeat"
                register={register}
                watch={watch}
              />
            </fieldset>
          </div>
        );

      case "secondaryAH":
        return (
          <div className={styles.section}>
            <h3>Вторичные АГ (исключение)</h3>
            <Textarea
              label="Как часто принимаете НПВС и парацетамол?"
              {...register("secondaryHypertension.nsaidsFrequency")}
              rows={2}
            />
            <NoteField
              noteKey="secondaryHypertension.nsaids"
              register={register}
              watch={watch}
            />
            <Textarea
              label="Как часто принимаете деконгестанты?"
              {...register("secondaryHypertension.decongestantsFrequency")}
              rows={2}
            />
            <NoteField
              noteKey="secondaryHypertension.decongestants"
              register={register}
              watch={watch}
            />
            <Textarea
              label="Другие препараты (антидепрессанты, ГКС, КОКи, бронхолитики и т.д.)"
              {...register("secondaryHypertension.otherDrugs")}
              rows={3}
            />
            <NoteField
              noteKey="secondaryHypertension.otherDrugs"
              register={register}
              watch={watch}
            />

            <fieldset className={styles.fieldset}>
              <legend>Гиперальдостеронизм</legend>
              <YesNo
                label="Полидипсия / полиурия"
                name="secondaryHypertension.hyperaldosteronism.polydipsiaPolyuria"
                register={register}
              />
              <YesNo
                label="Преходящая мышечная слабость"
                name="secondaryHypertension.hyperaldosteronism.muscleWeakness"
                register={register}
              />
              <YesNo
                label="Судороги конечностей"
                name="secondaryHypertension.hyperaldosteronism.limbCramps"
                register={register}
              />
              <YesNo
                label="Запоры"
                name="secondaryHypertension.hyperaldosteronism.constipation"
                register={register}
              />
              <NoteField
                noteKey="secondaryHypertension.hyperaldosteronism"
                register={register}
                watch={watch}
              />
            </fieldset>

            <YesNo
              label="Частые головные боли"
              name="secondaryHypertension.frequentHeadaches"
              register={register}
            />
            <YesNo
              label="Инсульт"
              name="secondaryHypertension.stroke"
              register={register}
            />
            <YesNo
              label="Транзиторная ишемическая атака"
              name="secondaryHypertension.tia"
              register={register}
            />
            {watch("secondaryHypertension.tia") === true && (
              <Textarea
                label="Детали ТИА"
                {...register("secondaryHypertension.tiaDetails")}
                rows={2}
              />
            )}

            <fieldset className={styles.fieldset}>
              <legend>🚩 Феохромоцитома</legend>
              <div className={styles.radioGroup}>
                <label>Динамика:</label>
                <label>
                  <input
                    type="radio"
                    value="stable"
                    {...register(
                      "secondaryHypertension.pheochromocytoma.stableOrCrisis",
                    )}
                  />{" "}
                  Стабильно повышено
                </label>
                <label>
                  <input
                    type="radio"
                    value="crisis"
                    {...register(
                      "secondaryHypertension.pheochromocytoma.stableOrCrisis",
                    )}
                  />{" "}
                  Кризовые подъёмы
                </label>
              </div>
              <YesNo
                label="Профузная потливость в моменты повышения"
                name="secondaryHypertension.pheochromocytoma.profuseSweating"
                register={register}
              />
              <YesNo
                label="Зябкость рук и ног"
                name="secondaryHypertension.pheochromocytoma.coldExtremities"
                register={register}
              />
              <YesNo
                label="Нарушения ритма"
                name="secondaryHypertension.pheochromocytoma.arrhythmias"
                register={register}
              />
              <NoteField
                noteKey="secondaryHypertension.pheochromocytoma"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Гиперкортицизм (синдром Кушинга)</legend>
              <YesNo
                label="Центральное ожирение"
                name="secondaryHypertension.hypercortisolism.centralObesity"
                register={register}
              />
              <YesNo
                label="Лунообразное лицо"
                name="secondaryHypertension.hypercortisolism.moonFace"
                register={register}
              />
              <YesNo
                label="Румянец на щеках"
                name="secondaryHypertension.hypercortisolism.cheekFlush"
                register={register}
              />
              <YesNo
                label="Горб буйвола"
                name="secondaryHypertension.hypercortisolism.buffaloHump"
                register={register}
              />
              <YesNo
                label="Синяки"
                name="secondaryHypertension.hypercortisolism.bruises"
                register={register}
              />
              <YesNo
                label="Проксимальная мышечная слабость"
                name="secondaryHypertension.hypercortisolism.proximalWeakness"
                register={register}
              />
              <YesNo
                label="Широкие и глубокие стрии"
                name="secondaryHypertension.hypercortisolism.striae"
                register={register}
              />
              <YesNo
                label="Вновь начавшийся СД (приём ГКС)"
                name="secondaryHypertension.hypercortisolism.newDiabetes"
                register={register}
              />
              <YesNo
                label="Аменорея"
                name="secondaryHypertension.hypercortisolism.amenorrhea"
                register={register}
              />
              <NoteField
                noteKey="secondaryHypertension.hypercortisolism"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Синдром обструктивного апноэ сна</legend>
              <YesNo
                label="Ночной храп"
                name="secondaryHypertension.osas.nightSnoring"
                register={register}
              />
              <YesNo
                label="Просыпаетесь ли ночью?"
                name="secondaryHypertension.osas.nightAwakenings"
                register={register}
              />
              <YesNo
                label="Ночное мочеиспускание"
                name="secondaryHypertension.osas.nocturia"
                register={register}
              />
              <YesNo
                label="Дневная сонливость"
                name="secondaryHypertension.osas.daytimeSleepiness"
                register={register}
              />
              <YesNo
                label="Ожирение"
                name="secondaryHypertension.osas.obesity"
                register={register}
              />
              <NoteField
                noteKey="secondaryHypertension.osas"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Семейный анамнез</legend>
              <YesNo
                label="Повышенное давление у родственников"
                name="secondaryHypertension.familyHistory.hypertension"
                register={register}
              />
              <YesNo
                label="Инфаркт или инсульт в молодом возрасте (муж <55, жен <65)"
                name="secondaryHypertension.familyHistory.earlyHeartAttackStroke"
                register={register}
              />
              <YesNo
                label="Феохромоцитома у родственников"
                name="secondaryHypertension.familyHistory.pheochromocytoma"
                register={register}
              />
              <NoteField
                noteKey="secondaryHypertension.familyHistory"
                register={register}
                watch={watch}
              />
            </fieldset>

            <YesNo
              label="Женщина: было ли во время беременности повышение давления, преэклампсия или эклампсия?"
              name="secondaryHypertension.pregnancyHypertension"
              register={register}
            />
          </div>
        );

      case "heartFailure":
        return (
          <div className={styles.section}>
            <h3>ХСН</h3>
            <YesNo
              label="Изменение цвета мочи?"
              name="heartFailure.urineColorChange"
              register={register}
            />
            {watch("heartFailure.urineColorChange") === true && (
              <Input
                label="Какой цвет?"
                {...register("heartFailure.urineColor")}
              />
            )}

            <YesNo
              label="Боли в груди / сердце"
              name="heartFailure.chestPain"
              register={register}
            />
            {watch("heartFailure.chestPain") === true && (
              <>
                <div className={styles.radioGroup}>
                  <label>Провоцирующий фактор:</label>
                  <label>
                    <input
                      type="radio"
                      value="none"
                      {...register("heartFailure.chestPainTrigger")}
                    />{" "}
                    Отсутствует
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="physical"
                      {...register("heartFailure.chestPainTrigger")}
                    />{" "}
                    Физ. нагрузка
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="emotional"
                      {...register("heartFailure.chestPainTrigger")}
                    />{" "}
                    Эмоц. стресс
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="positional"
                      {...register("heartFailure.chestPainTrigger")}
                    />{" "}
                    Изменение положения тела
                  </label>
                </div>
                <YesNo
                  label="Иррадиация в левую руку"
                  name="heartFailure.radiatesToLeftArm"
                  register={register}
                />
                <YesNo
                  label="Проходят от нитроглицерина / фосфалюгеля"
                  name="heartFailure.relievesWithNitroglycerin"
                  register={register}
                />
                <YesNo
                  label="За последние 3 месяца — учащение приступов?"
                  name="heartFailure.frequentAttacks3Months"
                  register={register}
                />
                <NoteField
                  noteKey="heartFailure.chestPain"
                  register={register}
                  watch={watch}
                />
              </>
            )}

            <YesNo
              label="Одышка при нагрузке"
              name="heartFailure.dyspneaOnExertion"
              register={register}
            />
            {watch("heartFailure.dyspneaOnExertion") === true && (
              <div className={styles.radioGroup}>
                <label>Функциональный класс:</label>
                <label>
                  <input
                    type="radio"
                    value="I"
                    {...register("heartFailure.dyspneaFunctionalClass")}
                  />{" "}
                  I (чрезмерная нагрузка)
                </label>
                <label>
                  <input
                    type="radio"
                    value="II"
                    {...register("heartFailure.dyspneaFunctionalClass")}
                  />{" "}
                  II (умеренное ограничение, &gt;2 этажей)
                </label>
                <label>
                  <input
                    type="radio"
                    value="III"
                    {...register("heartFailure.dyspneaFunctionalClass")}
                  />{" "}
                  III (&lt;2 этажей)
                </label>
                <label>
                  <input
                    type="radio"
                    value="IV"
                    {...register("heartFailure.dyspneaFunctionalClass")}
                  />{" "}
                  IV (в покое)
                </label>
              </div>
            )}

            <YesNo
              label="Принимает тикагрелор"
              name="heartFailure.takesTicagrelor"
              register={register}
            />

            <fieldset className={styles.fieldset}>
              <legend>Малый круг кровообращения</legend>
              <YesNo
                label="Во время сна подкладываете подушки под спину?"
                name="heartFailure.smallCircle.pillowsForSleep"
                register={register}
              />
              <YesNo
                label="Усиливается ли одышка ночью? Просыпаетесь ли из-за одышки?"
                name="heartFailure.smallCircle.nightDyspnea"
                register={register}
              />
              <label>Акроцианоз:</label>
              <label>
                <input
                  type="checkbox"
                  {...register(
                    "heartFailure.smallCircle.acrocyanosis.nasolabialTriangle",
                  )}
                />{" "}
                Носогубный треугольник
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("heartFailure.smallCircle.acrocyanosis.hands")}
                />{" "}
                Кисти
              </label>
              <label>
                <input
                  type="checkbox"
                  {...register("heartFailure.smallCircle.acrocyanosis.feet")}
                />{" "}
                Стопы
              </label>
              <Input
                label="Сатурация"
                type="number"
                suffix="%"
                {...register("heartFailure.smallCircle.saturation")}
              />
              <NoteField
                noteKey="heartFailure.smallCircle"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Большой круг — отёки ног</legend>
              <YesNo
                label="Отёки ног"
                name="heartFailure.bigCircle.legEdema"
                register={register}
              />
              <YesNo
                label="Теснота обуви к концу дня, след от резинки носков"
                name="heartFailure.bigCircle.tightShoes"
                register={register}
              />
              <div className={styles.radioGroup}>
                <label>Давно появились отёки?</label>
                <label>
                  <input
                    type="radio"
                    value="long"
                    {...register("heartFailure.bigCircle.edemaOnset")}
                  />{" "}
                  Давно
                </label>
                <label>
                  <input
                    type="radio"
                    value="acute"
                    {...register("heartFailure.bigCircle.edemaOnset")}
                  />{" "}
                  Остро (исключить ТГВ)
                </label>
              </div>
              <YesNo
                label="Симметричные?"
                name="heartFailure.bigCircle.symmetric"
                register={register}
              />
              <Input
                label="Локализация (стопы, голени, крестец, мошонка)"
                {...register("heartFailure.bigCircle.localization")}
              />
              <div className={styles.radioGroup}>
                <label>Время появления:</label>
                <label>
                  <input
                    type="radio"
                    value="morning"
                    {...register("heartFailure.bigCircle.timeOfDay")}
                  />{" "}
                  Утро
                </label>
                <label>
                  <input
                    type="radio"
                    value="evening"
                    {...register("heartFailure.bigCircle.timeOfDay")}
                  />{" "}
                  Вечер
                </label>
              </div>
              <YesNo
                label="Проходят ли отёки за ночь?"
                name="heartFailure.bigCircle.edemaImprovesNight"
                register={register}
              />
              <YesNo
                label="Становится ли лучше при возвышенном положении?"
                name="heartFailure.bigCircle.edemaImprovesElevation"
                register={register}
              />

              <div className={styles.row}>
                <div>
                  <label>Температура</label>
                  <select
                    {...register("heartFailure.bigCircle.edemaTemperature")}
                  >
                    <option value="">—</option>
                    <option value="cold">Холодная</option>
                    <option value="hot">Горячая</option>
                  </select>
                </div>
                <div>
                  <label>Цвет</label>
                  <select {...register("heartFailure.bigCircle.edemaColor")}>
                    <option value="">—</option>
                    <option value="pale">Бледный</option>
                    <option value="cyanotic">Цианотичный</option>
                    <option value="hyperemic">Гиперемия</option>
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>Плотность</label>
                  <select {...register("heartFailure.bigCircle.edemaDensity")}>
                    <option value="">—</option>
                    <option value="soft">Мягкие</option>
                    <option value="dense">Плотные</option>
                  </select>
                </div>
                <div>
                  <label>Исчезает</label>
                  <select {...register("heartFailure.bigCircle.edemaResolves")}>
                    <option value="">—</option>
                    <option value="immediate">Сразу</option>
                    <option value="delayed">Спустя время</option>
                  </select>
                </div>
              </div>

              <YesNo
                label="Ямка при нажатии"
                name="heartFailure.bigCircle.pittingEdema"
                register={register}
              />
              <YesNo
                label="Болезненность"
                name="heartFailure.bigCircle.painful"
                register={register}
              />
              <YesNo
                label="Принимает нифедипин, амлодипин, НПВС"
                name="heartFailure.bigCircle.takesNifedipineAmlodipineNsaids"
                register={register}
              />
              <NoteField
                noteKey="heartFailure.bigCircle"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Гепатомегалия</legend>
              <YesNo
                label="Чувствуете боли/дискомфорт в правом подреберье?"
                name="heartFailure.hepatomegaly.rightHypochondriumPain"
                register={register}
              />
              <div className={styles.radioGroup}>
                <label>Размер печени:</label>
                <label>
                  <input
                    type="radio"
                    value="enlarged"
                    {...register("heartFailure.hepatomegaly.liverSize")}
                  />{" "}
                  Увеличена
                </label>
                <label>
                  <input
                    type="radio"
                    value="notPalpable"
                    {...register("heartFailure.hepatomegaly.liverSize")}
                  />{" "}
                  Не пальпируется
                </label>
              </div>
              <div className={styles.radioGroup}>
                <label>Край:</label>
                <label>
                  <input
                    type="radio"
                    value="smooth"
                    {...register("heartFailure.hepatomegaly.liverEdge")}
                  />{" "}
                  Гладкий
                </label>
                <label>
                  <input
                    type="radio"
                    value="bumpy"
                    {...register("heartFailure.hepatomegaly.liverEdge")}
                  />{" "}
                  Бугристый
                </label>
                <label>
                  <input
                    type="radio"
                    value="notDefined"
                    {...register("heartFailure.hepatomegaly.liverEdge")}
                  />{" "}
                  Не определяется
                </label>
              </div>
              <YesNo
                label="Болезненность"
                name="heartFailure.hepatomegaly.liverPainful"
                register={register}
              />
              <YesNo
                label="Придаточная пульсация"
                name="heartFailure.hepatomegaly.hepaticPulsation"
                register={register}
              />
              <YesNo
                label="Гепатоеюнальный рефлюкс"
                name="heartFailure.hepatomegaly.hepatojugularReflux"
                register={register}
              />
              <NoteField
                noteKey="heartFailure.hepatomegaly"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Набухание яремных вен (голова 45°)</legend>
              <YesNo
                label="На вдохе и выдохе"
                name="heartFailure.jugularVeins.onInspirationAndExpiration"
                register={register}
              />
              <YesNo
                label="Только на вдохе"
                name="heartFailure.jugularVeins.onlyOnInspiration"
                register={register}
              />
              <NoteField
                noteKey="heartFailure.jugularVeins"
                register={register}
                watch={watch}
              />
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Стадия по NYHA</legend>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    value="I"
                    {...register("heartFailure.nyhaClass")}
                  />{" "}
                  I — скрытая НК
                </label>
                <label>
                  <input
                    type="radio"
                    value="IIA"
                    {...register("heartFailure.nyhaClass")}
                  />{" "}
                  IIA — прогрессирующее снижение толерантности
                </label>
                <label>
                  <input
                    type="radio"
                    value="IIB"
                    {...register("heartFailure.nyhaClass")}
                  />{" "}
                  IIB — выраженные признаки в покое
                </label>
                <label>
                  <input
                    type="radio"
                    value="III"
                    {...register("heartFailure.nyhaClass")}
                  />{" "}
                  III — конечная
                </label>
              </div>
              <NoteField
                noteKey="heartFailure.nyhaClass"
                register={register}
                watch={watch}
              />
            </fieldset>
          </div>
        );

      case "h2fpef":
        return (
          <div className={styles.section}>
            <h3>Шкала H2FPEF</h3>
            <label>
              <input type="checkbox" {...register("h2fpef.obesityBMI30")} />{" "}
              Ожирение ИМТ &gt;30 кг/м² (2 балла)
            </label>
            <label>
              <input
                type="checkbox"
                {...register("h2fpef.hypertension2Drugs")}
              />{" "}
              АГ, приём &gt;2 АП (1 балл)
            </label>
            <label>
              <input
                type="checkbox"
                {...register("h2fpef.atrialFibrillation")}
              />{" "}
              Фибрилляция предсердий (3 балла)
            </label>
            <label>
              <input
                type="checkbox"
                {...register("h2fpef.pulmonaryHypertension")}
              />{" "}
              Лёгочная гипертензия СДЛА &gt;35 мм рт.ст. (1 балл)
            </label>
            <Input
              label="СДЛА"
              type="number"
              suffix="мм рт. ст."
              {...register("h2fpef.pulmonaryHypertensionValue")}
            />
            <label>
              <input type="checkbox" {...register("h2fpef.elderly60")} />{" "}
              Возраст &gt;60 лет (1 балл)
            </label>
            <label>
              <input type="checkbox" {...register("h2fpef.fillingPressure")} />{" "}
              Давление наполнения E/e' &gt;9 (1 балл)
            </label>
            <Input
              label="E/e'"
              type="number"
              step="0.1"
              {...register("h2fpef.fillingPressureValue")}
            />

            <div className={styles.totalScore}>
              Сумма баллов: <strong>{watch("h2fpef.totalScore") ?? 0}</strong>
              <div>
                {(watch("h2fpef.totalScore") ?? 0) >= 5 &&
                  "ХСНсФВ высоковероятна"}
                {(watch("h2fpef.totalScore") ?? 0) >= 2 &&
                  (watch("h2fpef.totalScore") ?? 0) <= 4 &&
                  "Промежуточный результат — требуется ДСТ или инвазивная оценка"}
                {(watch("h2fpef.totalScore") ?? 0) <= 1 &&
                  "ХСНсФВ маловероятна"}
              </div>
            </div>

            <NoteField
              noteKey="h2fpef"
              register={register}
              watch={watch}
              label="Примечание по H2FPEF"
            />
          </div>
        );

      case "additional":
        return (
          <div className={styles.section}>
            <h3>Дополнительный анамнез</h3>
            <Input
              label="ИМ от (год)"
              {...register("additionalHistory.myocardialInfarction")}
            />
            <NoteField
              noteKey="additionalHistory.myocardialInfarction"
              register={register}
              watch={watch}
            />
            <Input
              label="Коронароангиография"
              {...register("additionalHistory.coronaryAngiography")}
            />
            <NoteField
              noteKey="additionalHistory.coronaryAngiography"
              register={register}
              watch={watch}
            />
            <Input
              label="Стентирование"
              {...register("additionalHistory.stenting")}
            />
            <NoteField
              noteKey="additionalHistory.stenting"
              register={register}
              watch={watch}
            />
            <Textarea
              label="Операции"
              {...register("additionalHistory.surgeries")}
              rows={2}
            />
            <NoteField
              noteKey="additionalHistory.surgeries"
              register={register}
              watch={watch}
            />
            <Input
              label="Аппендицит"
              {...register("additionalHistory.appendicitis")}
            />
            <Input
              label="Холецистит"
              {...register("additionalHistory.cholecystitis")}
            />
            <Input
              label="Туберкулёз"
              {...register("additionalHistory.tuberculosis")}
            />
            <Input label="ВИЧ" {...register("additionalHistory.hiv")} />
            <Input
              label="Гепатит"
              {...register("additionalHistory.hepatitis")}
            />
            <Input
              label="Сифилис"
              {...register("additionalHistory.syphilis")}
            />
            <Input
              label="Ковид (год)"
              {...register("additionalHistory.covidYear")}
            />
            <NoteField
              noteKey="additionalHistory.infections"
              register={register}
              watch={watch}
              label="Примечание по инфекциям / операциям"
            />

            <fieldset className={styles.fieldset}>
              <legend>Аллергии</legend>
              <Input
                label="На что?"
                {...register("additionalHistory.allergies.what")}
              />
              <Input
                label="Как проявляется?"
                {...register("additionalHistory.allergies.how")}
              />
              <YesNo
                label="Ангионевротический отёк был?"
                name="additionalHistory.allergies.angioedema"
                register={register}
              />
              {watch("additionalHistory.allergies.angioedema") === true && (
                <div className={styles.warning}>🚩 Запрет на приём иАПФ</div>
              )}
              <NoteField
                noteKey="additionalHistory.allergies"
                register={register}
                watch={watch}
              />
            </fieldset>

            <YesNo
              label="За пределы РФ не выезжали?"
              name="additionalHistory.travelOutsideRF"
              register={register}
            />
            <YesNo
              label="Контакт с больными?"
              name="additionalHistory.contactWithPatients"
              register={register}
            />
            <YesNo
              label="Укусы насекомых, животных"
              name="additionalHistory.insectAnimalBites"
              register={register}
            />

            <fieldset className={styles.fieldset}>
              <legend>Измерения</legend>
              <div className={styles.row}>
                <Input
                  label="Вес"
                  type="number"
                  step="0.1"
                  suffix="кг"
                  {...register("additionalHistory.weight")}
                />
                <Input
                  label="Рост"
                  type="number"
                  suffix="см"
                  {...register("additionalHistory.height")}
                />
                <Input
                  label="Окружность живота"
                  type="number"
                  suffix="см"
                  {...register("additionalHistory.abdominalCircumference")}
                />
              </div>
              <NoteField
                noteKey="additionalHistory.measurements"
                register={register}
                watch={watch}
              />
            </fieldset>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.tabsWrapper}>
        <div className={styles.tabsList}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.tabContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {renderTab()}
            <div className={styles.actions}>
              <Button type="submit" variant="primary">
                {anamnesisId ? "Редактировать" : "Сохранить"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
