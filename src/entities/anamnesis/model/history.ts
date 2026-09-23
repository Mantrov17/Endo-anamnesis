// ==================== Гипогликемии ====================

export interface Hypoglycemia {
  frequencyPerWeek: number | null;

  severeEpisodes: boolean | null;

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
  frequency: string;

  sameTime: boolean | null;

  ifNotSameTimeReason: string;

  diary: boolean | null;

  needleChangeFrequency: string;

  siteChangeFrequency: string;

  injectionSiteDistance: string;

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

  energyDrinks: boolean | null;

  occupation: string;

  sedentaryWork: boolean | null;

  stress: boolean | null;

  chronicEyeDiseases: string;

  asthma: boolean | null;

  asthmaDiagnosedWhen: string;

  asthmaAllergen: string;

  copd: boolean | null;

  copdMeds: string;

  knownHypertension: "yes" | "no" | "notMeasured" | "";

  hypertensionFirstDetected: string;

  hypertensionUnderAge35: boolean;

  hypertensionDetectionMethod:
    | "accidental"
    | "dispanserization"
    | "withComplaints"
    | "hospitalization"
    | "ems"
    | "";

  visitedDoctorAfterDetection: boolean | null;

  prescribedTherapyThen: string;

  therapyRegularity: boolean | null;

  missedDosesPerWeek: string;

  missedReasons: string;

  bpOnTherapy: string;

  bpResistant3Drugs: boolean | null;

  selfDiscontinued: boolean | null;

  doctorChangedTherapy: boolean | null;

  changedTherapyDetails: string;

  measureAtHome: boolean | null;

  measureFrequency: string;

  keepDiary: boolean | null;

  maxBPValues: string;

  subjectiveComplaints: string;

  atWhatBPReduced: string;

  hypertensiveCrisesAmbulance: boolean | null;

  crisesCount: string;

  crisesSymptoms: string;

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
