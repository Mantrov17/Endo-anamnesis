import * as yup from "yup";

// Валидация для СД1 (обязательна, если выбран СД1)
const type1DiabetesSchema = yup.object({
  ageAtDiagnosis: yup
    .number()
    .typeError("Введите число")
    .min(0, "Возраст не может быть отрицательным")
    .nullable()
    .when("$isType1", (isType1, schema) =>
      isType1 ? schema.required("Укажите возраст постановки диагноза") : schema,
    ),
  yearOfDiagnosis: yup
    .string()
    .when("$isType1", (isType1, schema) =>
      isType1 ? schema.required("Укажите год постановки диагноза") : schema,
    ),
  howDiagnosed: yup
    .string()
    .oneOf(["accidental", "planned", "hospitalization", ""])
    .when("$isType1", (isType1, schema) =>
      isType1 ? schema.required("Выберите способ диагностики") : schema,
    ),
  circumstances: yup.string(),
  glycemiaAtOnset: yup
    .number()
    .typeError("Введите число")
    .nullable()
    .when("$isType1", (isType1, schema) =>
      isType1 ? schema.required("Укажите уровень гликемии") : schema,
    ),
  classicSymptoms: yup.object({
    polyuria: yup.boolean(),
    polydipsia: yup.boolean(),
    weakness: yup.boolean(),
    weightLoss: yup.boolean(),
    weightLossAmount: yup
      .number()
      .typeError("Введите число")
      .nullable()
      .when("weightLoss", (weightLoss, schema) =>
        weightLoss ? schema.required("Укажите потерю веса") : schema,
      ),
  }),
  furtherPlan: yup.string(),
  initialTherapy: yup
    .array()
    .of(
      yup.object({
        drugName: yup.string(),
        dose: yup.string(),
      }),
    )
    .when("$isType1", (isType1, schema) =>
      isType1 ? schema.min(1, "Добавьте хотя бы один препарат") : schema,
    ),
  stillTakingInitialTherapy: yup.boolean(),
  ifNotTakingReason: yup.string(),
  autoantibodies: yup.object({
    GAD: yup.boolean(),
    IA2: yup.boolean(),
    ZnT8: yup.boolean(),
    IAA: yup.boolean(),
    results: yup.string(),
  }),
  cPeptide: yup
    .object({
      value: yup.string(),
      date: yup.string(),
    })
    .nullable(),
  hba1c: yup
    .object({
      value: yup.number().typeError("Введите число").nullable(),
      date: yup.string(),
    })
    .nullable(),
  usualGlucose: yup.number().typeError("Введите число").nullable(),
});

// Валидация остальных секций (не обязательные поля, но можно добавить)
const therapySchema = yup.object({
  currentDrugs: yup.array().of(
    yup.object({
      name: yup.string(),
      dose: yup.string(),
    }),
  ),
  basalInsulin: yup.array().of(
    yup.object({
      name: yup.string(),
      dose: yup.string(),
    }),
  ),
  prandialInsulin: yup.array().of(
    yup.object({
      name: yup.string(),
      dose: yup.string(),
    }),
  ),
  carbCounting: yup.boolean(),
  carbRatio: yup.string(),
  injectionSites: yup.string(),
  needleChangeFrequency: yup.string(),
  injectionTechnique: yup.string(),
  siteChangeFrequency: yup.string(),
  lipohypertrophy: yup.boolean(),
});

const hypoglycemiaSchema = yup.object({
  frequencyPerWeek: yup.number().typeError("Введите число").nullable(),
  severeEpisodes: yup
    .object({
      count: yup.number().typeError("Введите число").nullable(),
      when: yup.string(),
      clinic: yup.string(),
    })
    .nullable(),
  awarenessPreserved: yup.boolean(),
  provokingFactors: yup.object({
    physicalActivity: yup.boolean(),
    missedMeal: yup.boolean(),
    alcohol: yup.boolean(),
  }),
  hasGlucagon: yup.boolean(),
  familyTrained: yup.boolean(),
  nocturnalHypoglycemia: yup.boolean(),
});

const lifestyleSchema = yup.object({
  selfMonitoringFrequency: yup.string(),
  sameTime: yup.boolean(),
  ifNotSameTimeReason: yup.string(),
  diary: yup.boolean(),
});

// Корневая схема
export const validationSchema = yup.object({
  fullName: yup
    .string()
    .required("Введите ФИО")
    .min(2, "Минимум 2 символа")
    .max(100, "Максимум 100 символов")
    .matches(/^[A-Za-zА-Яа-яЁё\s-]+$/, "Только буквы, пробелы и дефис"),
  birthDate: yup.string().required("Укажите дату рождения"),
  gender: yup
    .string()
    .oneOf(["male", "female"], "Выберите пол")
    .required("Выберите пол"),

  primaryExam: yup.object({
    reason: yup.string().required("Укажите причину обращения"),
    suspectedDiagnosis: yup
      .string()
      .oneOf(["type1", "type2"], "Выберите тип диабета")
      .required("Выберите предполагаемый диагноз"),
  }),
  type1Diabetes: type1DiabetesSchema.nullable(),
  therapy: therapySchema,
  hypoglycemia: hypoglycemiaSchema,
  lifestyle: lifestyleSchema,
});
