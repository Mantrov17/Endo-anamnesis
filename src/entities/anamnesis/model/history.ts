// ==================== Гипогликемии ====================

export interface Hypoglycemia {
  hasGlucoseBelow39: boolean | null;

  frequencyPerWeek: number | null;

  reliefMethod: string;

  severeEpisodes: boolean | null;

  severeEpisodesDetails: string;

  severeEpisodesCount: number | null;

  severeEpisodesWhen: string;

  severeEpisodesClinic: string;

  awarenessPreserved: boolean | null;

  provokingFactors: {
    physicalActivity: boolean;
    missedMeal: boolean;
    alcohol: boolean;
  };

  hasGlucagon: boolean | null;

  familyTrained: boolean | null;

  nocturnalHypoglycemia: boolean | null;

  severity: "mild" | "severe" | "";

  symptoms: {
    hunger: boolean;
    tremor: boolean;
    sweating: boolean;
    tachycardia: boolean;
    anxiety: boolean;
    weakness: boolean;
    diplopia: boolean;
    headache: boolean;
  };
}

// ==================== Самоконтроль ====================

export interface SelfMonitoring {
  injectionSites: {
    abdomen: boolean;
    thighs: boolean;
    buttocks: boolean;
    lumbar: boolean;
    shoulders: boolean;
  };

  /*
   * Дополнительные сведения о местах инъекций.
   * Общее поле для всех типов диабета.
   */
  injectionSitesDetails: string;

  glucoseSensor: boolean;

  noMonitoringDevices: boolean;

  averageGlucoseMin: number | null;

  averageGlucoseMax: number | null;

  injectionTechnique: "correct" | "incorrect" | "";

  injectionSiteChangeFrequency: string;

  needleLengths: {
    mm4: boolean;
    mm5: boolean;
    mm6: boolean;
    mm12: boolean;
  };

  needleChangeFrequency: string;

  /**
   * Общее состояние мест инъекций для обоих типов СД.
   * Старые значения из type1Diabetes.injectionSitesInfo
   * переносятся при нормализации без удаления исходных данных.
   */
  injectionSiteCondition: {
    lipodystrophy: {
      lipohypertrophy: boolean;
      lipoatrophy: boolean;
      none: boolean;
    };
    tenderness: boolean | null;
    hyperemia: boolean | null;
    skinTemperature: "normal" | "hyperthermia" | "";
  };

  /** Признак однократного переноса данных из старой формы СД 1. */
  injectionSiteDetailsMigrated?: boolean;

  insulinStorage: "correct" | "incorrect" | "";

  mealRegularity: "regular" | "irregular" | "";

  dietAdherence: boolean | null;

  frequencyRegularity: "regular" | "irregular" | "";

  frequency: string;

  diary: boolean | null;

  hasGlucometer: boolean | null;

  calibrationDone: boolean | null;

  lastDoctorVisit: string;

  lastDoctorVisitUnknown: boolean;
}

// ==================== Осмотр ====================

export interface Examination {
  cardiovascularEvents: string;

  bloodPressure: string;

  otherChronicDiseases: string;

  currentMedications: string;

  allergies: string;

  hospitalizations: string;

  vaccinations: string;

  thyroidDisease: boolean | null;

  celiacDisease: boolean | null;

  otherAutoimmune: string;

  familyHistory: string;

  pregnancies: number | null;

  births: number | null;

  menstrualCycle: string;
}

// ==================== Образ жизни ====================

export interface Lifestyle {
  alcoholFrequency: string;
  alcoholType: string;

  smoking: boolean | null;

  smokingStartAge: number | null;

  cigarettesPerDay: number | null;

  saltFood: boolean | null;

  processedFood: boolean | null;

  coffeeCupsPerDay: number | null;

  strongCoffee: boolean | null;

  energyDrinks: number | null;

  occupation: string;

  sedentaryWork: boolean | null;

  stress: boolean | null;

  chronicEyeDiseases: string;

  asthma: boolean | null;

  asthmaDiagnosedWhen: string;

  asthmaAllergen: string;

  copd: boolean | null;

  copdMeds: string;

  // Артериальная гипертензия

  knownHypertension: "yes" | "no" | "notMeasured" | "";

  hypertensionFirstDetected: string;

  hypertensionUnderAge35: boolean;

  hypertensionDetectionEnabled?: boolean | null;

  hypertensionDetectionDetails?: string;

  hypertensionDetectionMethod:
    | "accidental"
    | "dispanserization"
    | "withComplaints"
    | "hospitalization"
    | "ems"
    | "";

  visitedDoctorAfterDetection: boolean | null;

  prescribedTherapyThen: string;

  actualAntihypertensiveTherapy?: ({
    name: string;
    dose: string;
  } & import("./diabetes").DrugScheduleDetails)[];

  therapyRegularity: boolean | null;

  missedDosesPerWeek: string;

  missedReasons: string;

  bpOnTherapy: string;

  bpResistant3Drugs: boolean | null;

  selfDiscontinued: boolean | null;

  doctorChangedTherapy: boolean | null;

  therapyCorrectionReason?: string;

  changedTherapyDetails: string;

  measureAtHome: boolean | null;

  measureFrequency: string;

  keepDiary: boolean | null;

  maxBPValues: string;

  subjectiveComplaints: string;

  hypertensionSymptoms?: {
    headache: boolean;
    tinnitus: boolean;
    visualDisturbances: boolean;
    palpitations: boolean;
    hotFlushes: boolean;
    chestPain: boolean;
    arrhythmia: boolean;
    dizziness: boolean;
    nauseaVomiting: boolean;
  };

  highBpReliefMedication?: string;

  atWhatBPReduced: string;

  hypertensiveCrisesAmbulance: boolean | null;

  crisesCount: string;

  crisesSymptoms: string;

  crisisSigns?: {
    severeHeadache: boolean;
    speechDisorder: boolean;
    visionDisorder: boolean;
    limbWeakness: boolean;
    seizures: boolean;
    lossOfConsciousness: boolean;
  };

  medicationHypertensionTriggers?: {
    glucocorticoids: boolean;
    combinedOralContraceptives: boolean;
    bronchodilators: boolean;
    erythropoietin: boolean;
    antiretroviralTherapy: boolean;
    licoriceSupplements: boolean;
    immunosuppressants: boolean;
  };

  heartRhythmRegular: boolean | null;

  pacemakers: boolean | null;

  atrialFibrillation: boolean | null;
}

// ==================== Дополнительный анамнез ====================

export interface AdditionalHistory {
  myocardialInfarction: string;

  coronaryAngiography: string;

  stenting: string;

  surgeries: string;

  appendicitis: string;

  cholecystitis: string;

  tuberculosis: string;

  hiv: string;

  hepatitis: string;

  syphilis: string;

  covidYear: string;

  allergies: {
    what: string;
    how: string;
    angioedema: boolean | null;
  };

  travelOutsideRF: boolean | null;

  contactWithPatients: boolean | null;

  insectAnimalBites: boolean | null;

  weight: number | null;

  height: number | null;

  abdominalCircumference: number | null;
}
