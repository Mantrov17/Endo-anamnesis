import type { AnamnesisFormData } from "@/entities/anamnesis";

type Type1DiabetesData = NonNullable<AnamnesisFormData["type1Diabetes"]>;

type Type2DiabetesData = NonNullable<AnamnesisFormData["type2Diabetes"]>;

export const createType1DiabetesDefaults = (): Type1DiabetesData => ({
  ageAtDiagnosis: null,
  yearOfDiagnosis: "",
  diseaseDuration: null,
  howDiagnosed: "",
  circumstances: "",
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

    basalInsulin: [
      {
        drugName: "",
        dose: "",
      },
    ],

    bolusInsulin: [
      {
        drugName: "",
        dose: "",
      },
    ],

    otherDrugsTaken: null,
    otherDrugs: "",
    usualGlucoseOnTherapy: null,
  },

  injectionSitesInfo: {
    sites: {
      abdomen: false,
      thighs: false,
      buttocks: false,
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
});

export const createType2DiabetesDefaults = (): Type2DiabetesData => ({
  firstGlucoseElevationYear: "",
  maxGlucoseValues: "",

  ageAtDiagnosis: null,
  yearOfDiagnosis: "",
  diseaseDuration: null,
  howDiagnosed: "",

  classicSymptoms: {
    polyuria: false,
    polydipsia: false,
    weakness: false,
    weightLoss: false,
    visionBlur: false,
  },

  investigatedAfterDetection: null,

  initialTherapy: [
    {
      drugName: "",
      dose: "",
      frequency: "",
    },
  ],

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

  usualGlucoseOnTherapy: null,

  hba1c: {
    tested: null,
    value: null,
    date: "",
    unknown: false,
  },

  gestationalDiabetes: null,
});
