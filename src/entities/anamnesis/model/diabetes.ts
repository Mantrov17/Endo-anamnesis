// ==================== Первичный осмотр ====================

export interface PrimaryExam {
  reason: string;

  /** Жалобы пациента на момент поступления. */
  complaints: string;

  suspectedDiagnosis?: "type1" | "type2" | "graves";

  height: number | null;
  weight: number | null;
  bmi: number | null;

  waistCircumference: number | null;

  weightChange6Months: boolean | null;

  weightIncreasedBy: number | null;

  weightDecreasedBy: number | null;

  weightChangeReason: "unmotivated" | "stress" | "diet" | "sport" | "";
}

// ==================== Гестационный сахарный диабет ====================

export interface GestationalDiabetesDetails {
  pregnancyType: "singleton" | "multiple" | "";

  diagnosisWeek: number | null;

  glycemiaAtDiagnosis: number | null;

  diagnosisAdditionalInfo: string;

  clinicalManifestations: {
    weakness: boolean;
    painfulItchyUrination: boolean;
    skinItching: boolean;
    polyuria: boolean;
    polydipsia: boolean;
    hunger: boolean;
  };

  clinicalManifestationsOther: string;

  therapy: string;

  polyhydramnios: boolean | null;

  newbornWeight: number | null;

  childPathologies: string;

  macrosomia: boolean | null;

  deliveryWeek: number | null;

  postpartumGlucoseNormalized: boolean | null;

  additionalInfo: string;
}

// ==================== Общие поля препаратов ====================

/**
 * Дополнительные сведения о препарате.
 *
 * Поля необязательные для совместимости
 * с ранее сохранёнными анкетами.
 */
export interface DrugScheduleDetails {
  tradeName?: string;

  frequency?: string;

  frequencyPeriod?: "day" | "week" | "month";

  timesOfDay?: {
    morning?: boolean;
    day?: boolean;
    evening?: boolean;
    night?: boolean;
  };
}

// ==================== СД 1 типа ====================

export interface Type1Diabetes {
  ageAtDiagnosis: number | null;

  yearOfDiagnosis: string;

  diseaseDuration: number | null;

  howDiagnosed:
    | "accidental"
    | "planned"
    | "dispanserization"
    | "withComplaints"
    | "emergency"
    | "";

  diagnosisDetails: string;

  glycemiaAtOnset: number | null;

  classicSymptoms: {
    polyuria: boolean;
    polydipsia: boolean;
    weakness: boolean;
    weightLoss: boolean;

    weightLossUnknown: boolean;

    nausea: boolean;
    vomiting: boolean;

    abdominalPain: boolean;

    visionBlur: boolean;

    lossOfConsciousness: boolean;

    other: boolean;
    otherDetails: string;
  };

  autoantibodies: {
    tested: boolean | null;

    GAD: boolean;

    GADValue: number | null;

    IA2: boolean;

    IA2Value: number | null;

    ZnT8: boolean;

    ZnT8Value: number | null;

    IAA: boolean;

    IAAValue: number | null;
  };

  cPeptide: {
    tested: boolean | null;

    value: string;
    date: string;
    unknown: boolean;
  };

  hba1c: {
    tested: boolean | null;

    value: number | null;

    date: string;
    unknown: boolean;
  };

  initialTherapy: {
    injectionMethod: "injections" | "pump" | "";

    injectionsDevice: "syringe" | "pen" | "";

    pumpModel: string;

    pumpInstallationYear: string;

    activeInsulin: ({
      drugName: string;
      dose: string;
    } & DrugScheduleDetails)[];

    basalInsulin: ({
      drugName: string;
      dose: string;
    } & DrugScheduleDetails)[];

    bolusInsulin: ({
      drugName: string;
      dose: string;
    } & DrugScheduleDetails)[];

    usualGlucoseOnTherapy: number | null;
  };

  injectionSitesInfo: {
    sites: {
      abdomen: boolean;
      thighs: boolean;
      buttocks: boolean;
      lumbar: boolean;
      shoulders: boolean;
    };

    siteChangeFrequency: string;

    needleChangeFrequency: string;

    lipodystrophy: {
      none: boolean;

      lipohypertrophy: boolean;

      lipoatrophy: boolean;
    };

    tenderness: boolean | null;

    skinTemperature: "normal" | "hyperthermia" | "";

    infiltrates: "none" | "present" | "";
  };

  investigatedAfterDetection: boolean | null;

  initiallyType2: boolean | null;

  gestationalDiabetes: boolean | null;

  gestationalDiabetesDetails: GestationalDiabetesDetails;

  familyHistoryDiabetes: boolean | null;

  familyHistoryDiabetesDetails: string;
}

// ==================== СД 2 типа ====================

export interface Type2Diabetes {
  maxGlucoseValues: string;

  ageAtDiagnosis: number | null;

  yearOfDiagnosis: string;

  diseaseDuration: number | null;

  howDiagnosed:
    | "accidental"
    | "dispanserization"
    | "withComplaints"
    | "hospitalization"
    | "";

  diagnosisDetails: string;

  glycemiaAtOnset: number | null;

  classicSymptoms: {
    // Существующие поля

    polyuria: boolean;
    polydipsia: boolean;
    weakness: boolean;
    weightLoss: boolean;
    visionBlur: boolean;

    // Новые клинические проявления

    skinItching: boolean;
    urinaryInfection: boolean;
    fingerParesthesia: boolean;
    hunger: boolean;

    // Сохраняем старые данные свободного ответа

    other: boolean;
    otherDetails: string;
  };

  investigatedAfterDetection: boolean | null;

  initialTherapy: ({
    drugName: string;
    dose: string;
    frequency: string;
  } & DrugScheduleDetails)[];

  insulinTherapy: boolean | null;

  insulinTherapyDetails: string;

  therapyRegularity: boolean | null;

  missedDosesPerWeek: string;

  missedReasons: {
    sideEffects: boolean;

    sideEffectsDetails: string;

    cost: boolean;
    complexity: boolean;

    forgetfulness: boolean;

    other: boolean;

    otherDetails: string;
  };

  therapySideEffects: boolean | null;

  therapySideEffectsDetails: string;

  usualGlucoseOnTherapy: number | null;

  hba1c: {
    tested: boolean | null;

    value: number | null;

    date: string;
    unknown: boolean;
  };

  gestationalDiabetes: boolean | null;

  gestationalDiabetesDetails: GestationalDiabetesDetails;

  familyHistoryDiabetes: boolean | null;

  familyHistoryDiabetesDetails: string;
}

// ==================== Актуальная терапия ====================

export interface ActualTherapy {
  sameAsInitial: boolean | null;

  correctionReason: string;

  correctedTherapy: string;

  injectionMethod: "injections" | "pump" | "";

  injectionsDevice: "syringe" | "pen" | "";

  pumpModel: string;

  basalInsulin: ({
    name: string;
    dose: string;
  } & DrugScheduleDetails)[];

  bolusInsulin: ({
    name: string;
    dose: string;
  } & DrugScheduleDetails)[];

  insulinDoseCoefficient: number | null;

  calculatedDailyInsulinDose: number | null;

  injectionSites: string;

  lipohypertrophy: boolean | null;
}

// ==================== Терапия ====================

export interface Therapy {
  targetHba1c: string;

  currentDrugs: ({
    name: string;
    dose: string;
  } & DrugScheduleDetails)[];

  basalInsulin: ({
    name: string;
    dose: string;
  } & DrugScheduleDetails)[];

  prandialInsulin: ({
    name: string;
    dose: string;
  } & DrugScheduleDetails)[];
}
