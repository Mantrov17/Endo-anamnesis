import type {
  AnamnesisFormData,
  GestationalDiabetesDetails,
} from "@/entities/anamnesis";

type Type1DiabetesData = NonNullable<AnamnesisFormData["type1Diabetes"]>;

type Type2DiabetesData = NonNullable<AnamnesisFormData["type2Diabetes"]>;

export const createGestationalDiabetesDetailsDefaults =
  (): GestationalDiabetesDetails => ({
    pregnancyType: "",
    diagnosisWeek: null,
    glycemiaAtDiagnosis: null,
    diagnosisAdditionalInfo: "",

    clinicalManifestations: {
      weakness: false,
      painfulItchyUrination: false,
      skinItching: false,
      polyuria: false,
      polydipsia: false,
      hunger: false,
    },

    clinicalManifestationsOther: "",
    therapy: "",
    polyhydramnios: null,
    newbornWeight: null,
    childPathologies: "",
    macrosomia: null,
    deliveryWeek: null,
    postpartumGlucoseNormalized: null,
    additionalInfo: "",
  });

export const createType1DiabetesDefaults = (): Type1DiabetesData => ({
  ageAtDiagnosis: null,
  yearOfDiagnosis: "",
  diseaseDuration: null,
  howDiagnosed: "",
  diagnosisDetails: "",
  glycemiaAtOnset: null,

  classicSymptoms: {
    polyuria: false,
    polydipsia: false,
    weakness: false,
    weightLoss: false,
    weightLossUnknown: false,
    nausea: false,
    vomiting: false,
    abdominalPain: false,
    visionBlur: false,
    lossOfConsciousness: false,

    other: false,
    otherDetails: "",
  },

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

  cPeptide: {
    tested: null,
    value: "",
    date: "",
    unknown: false,
  },

  hba1c: {
    tested: null,
    value: null,
    date: "",
    unknown: false,
  },

  initialTherapy: {
    injectionMethod: "",
    injectionsDevice: "",
    pumpModel: "",
    pumpInstallationYear: "",

    activeInsulin: [
      {
        drugName: "",
        tradeName: "",
        dose: "",
        frequency: "",
        frequencyPeriod: "day",
        timesOfDay: {
          morning: false,
          day: false,
          evening: false,
          night: false,
        },
      },
    ],

    basalInsulin: [
      {
        drugName: "",
        tradeName: "",
        dose: "",
        frequency: "",
        frequencyPeriod: "day",
        timesOfDay: {
          morning: false,
          day: false,
          evening: false,
          night: false,
        },
      },
    ],

    bolusInsulin: [
      {
        drugName: "",
        tradeName: "",
        dose: "",
        frequency: "",
        frequencyPeriod: "day",
        timesOfDay: {
          morning: false,
          day: false,
          evening: false,
          night: false,
        },
      },
    ],

    usualGlucoseOnTherapy: null,
  },

  injectionSitesInfo: {
    sites: {
      abdomen: false,
      thighs: false,
      buttocks: false,
      lumbar: false,
      shoulders: false,
    },

    siteChangeFrequency: "",
    needleChangeFrequency: "",

    lipodystrophy: {
      none: false,
      lipohypertrophy: false,
      lipoatrophy: false,
    },

    tenderness: null,
    skinTemperature: "",
    infiltrates: "",
  },

  investigatedAfterDetection: null,
  initiallyType2: null,

  gestationalDiabetes: null,
  gestationalDiabetesDetails: createGestationalDiabetesDetailsDefaults(),

  familyHistoryDiabetes: null,
  familyHistoryDiabetesDetails: "",
});

export const createType2DiabetesDefaults = (): Type2DiabetesData => ({
  maxGlucoseValues: "",

  ageAtDiagnosis: null,
  yearOfDiagnosis: "",
  diseaseDuration: null,
  howDiagnosed: "",
  diagnosisDetails: "",
  glycemiaAtOnset: null,

  classicSymptoms: {
    polyuria: false,
    polydipsia: false,
    weakness: false,
    weightLoss: false,
    visionBlur: false,

    other: false,
    otherDetails: "",
  },

  investigatedAfterDetection: null,

  initialTherapy: [
    {
      drugName: "",
      tradeName: "",
      dose: "",
      frequency: "",
      frequencyPeriod: "day",
      timesOfDay: {
        morning: false,
        day: false,
        evening: false,
        night: false,
      },
    },
  ],

  insulinTherapy: null,
  insulinTherapyDetails: "",

  therapyRegularity: null,
  missedDosesPerWeek: "",

  missedReasons: {
    sideEffects: false,
    sideEffectsDetails: "",
    cost: false,
    complexity: false,
    forgetfulness: false,
    other: false,
    otherDetails: "",
  },

  therapySideEffects: null,
  therapySideEffectsDetails: "",

  usualGlucoseOnTherapy: null,

  hba1c: {
    tested: null,
    value: null,
    date: "",
    unknown: false,
  },

  gestationalDiabetes: null,
  gestationalDiabetesDetails: createGestationalDiabetesDetailsDefaults(),

  familyHistoryDiabetes: null,
  familyHistoryDiabetesDetails: "",
});
