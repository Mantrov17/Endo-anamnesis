// ==================== Первичный осмотр ====================

export interface PrimaryExam {
  reason: string;

  suspectedDiagnosis?: "type1" | "type2";

  height: number | null;
  weight: number | null;
  bmi: number | null;

  waistCircumference: number | null;

  weightChange6Months: boolean | null;

  weightIncreasedBy: number | null;

  weightDecreasedBy: number | null;

  weightChangeReason: "unmotivated" | "stress" | "diet" | "sport" | "";
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

  circumstances: string;

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

    basalInsulin: {
      drugName: string;
      dose: string;
    }[];

    bolusInsulin: {
      drugName: string;
      dose: string;
    }[];

    otherDrugsTaken: boolean | null;

    otherDrugs: string;

    usualGlucoseOnTherapy: number | null;
  };

  injectionSitesInfo: {
    sites: {
      abdomen: boolean;
      thighs: boolean;
      buttocks: boolean;
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
}

// ==================== СД 2 типа ====================

export interface Type2Diabetes {
  firstGlucoseElevationYear: string;

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

  classicSymptoms: {
    polyuria: boolean;
    polydipsia: boolean;
    weakness: boolean;
    weightLoss: boolean;
    visionBlur: boolean;
  };

  investigatedAfterDetection: boolean | null;

  initialTherapy: {
    drugName: string;
    dose: string;
    frequency: string;
  }[];

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

  usualGlucoseOnTherapy: number | null;

  hba1c: {
    tested: boolean | null;

    value: number | null;

    date: string;
    unknown: boolean;
  };

  gestationalDiabetes: boolean | null;
}

// ==================== Актуальная терапия ====================

export interface ActualTherapy {
  sameAsInitial: boolean | null;

  correctionReason: string;

  correctedTherapy: string;

  injectionMethod: "injections" | "pump" | "";

  injectionsDevice: "syringe" | "pen" | "";

  pumpModel: string;

  basalInsulin: {
    name: string;
    dose: string;
  }[];

  bolusInsulin: {
    name: string;
    dose: string;
  }[];

  insulinDoseCoefficient: number | null;

  calculatedDailyInsulinDose: number | null;

  injectionSites: string;

  lipohypertrophy: boolean | null;
}

// ==================== Терапия ====================

export interface Therapy {
  targetHba1c: string;

  currentDrugs: {
    name: string;
    dose: string;
  }[];

  basalInsulin: {
    name: string;
    dose: string;
  }[];

  prandialInsulin: {
    name: string;
    dose: string;
  }[];
}
