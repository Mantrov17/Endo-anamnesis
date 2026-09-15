// ==================== Базовые ====================
export interface PatientBase {
  fullName: string;
  birthDate: string;
  gender?: "male" | "female";
}

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
    weightLossAmount: number | null;
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
  usualGlucose: number | null;

  initialTherapy: {
    injectionMethod: "injections" | "pump" | "";
    injectionsDevice: "syringe" | "pen" | "";
    pumpModel: string;
    basalInsulin: { drugName: string; dose: string }[];
    bolusInsulin: { drugName: string; dose: string }[];
    otherDrugsTaken: boolean | null;
    otherDrugs: string;
    usualGlucoseOnTherapy: number | null;
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
    weightLossAmount: number | null;
    weightLossUnknown: boolean;
    visionBlur: boolean;
  };
  investigatedAfterDetection: boolean | null;
  initialTherapy: { drugName: string; dose: string }[];
  stillTakingInitialTherapy: boolean | null;
  ifNotTakingReason: string;
  currentTherapy: { drugName: string; dose: string }[];
  therapyRegularity: boolean | null;
  missedDosesPerWeek: string;
  missedReasons: string;
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
  injectionMethod: "injections" | "pump" | "";
  injectionsDevice: "syringe" | "pen" | "";
  pumpModel: string;
  basalInsulin: { name: string; dose: string }[];
  bolusInsulin: { name: string; dose: string }[];
  insulinDoseCoefficient: number | null;
  calculatedDailyInsulinDose: number | null;
  injectionSites: string;
  lipohypertrophy: boolean | null;
}

// ==================== Терапия (общая) ====================
export interface Therapy {
  targetHba1c: string;
  currentDrugs: { name: string; dose: string }[];
  basalInsulin: { name: string; dose: string }[];
  prandialInsulin: { name: string; dose: string }[];
  carbCounting: boolean | null;
  carbRatio: string;
  injectionSites: string;
  lipohypertrophy: boolean | null;
}

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

// ==================== Осложнения ====================
export interface Complications {
  eyes: {
    visionLoss: boolean | null;
    visionLossStart: string;
    visionLossDuration: string;
    nightVisionGood: boolean | null;
    lastFundusExamDate: string;
    nyctalopia: boolean | null;
    delayedDarkAdaptation: boolean | null;
    floaters: boolean | null;
    floatersWhen: string;
    visualFieldLoss: boolean | null;
    ophthalmologistFrequency: string;
    lastFundusExamUnknown: boolean;
  };
  nose: { snoring: boolean | null };
  ears: {
    hearingLoss: boolean | null;
    hearingLossStart: string;
    hearingLossDuration: string;
    lastEntExamDate: string;
  };
  gastrointestinal: {
    gastritis: boolean | null;
    ulcers: boolean | null;
    abdominalPainAfterEating: boolean | null;
    stoolFrequency: string;
    stoolConsistency: number | null;
    painTriggerFatty: boolean;
    painTriggerAlcohol: boolean;
  };
  urinary: { kidneyStones: boolean | null };
  nephropathy: { albuminCreatinine: string; gfr: string };
  neuropathy: {
    symptoms: { numbness: boolean; pain: boolean; paresthesia: boolean };
    numbnessTime: "day" | "night" | "any" | "";
    paresthesiaType: {
      crawling: boolean;
      shots: boolean;
      allodynia: boolean;
      hyperalgesia: boolean;
      nightCramps: boolean;
      numbness: boolean;
      burning: boolean;
    };
    coldFeet: boolean | null;
    howWarmFeet: string;
    feetToRadiator: boolean | null;
    amputations: boolean | null;
    amputationLevel: string;
    amputationDate: string;
    footSkin: "hyperkeratosis" | "dry" | "normal" | "moist" | "";
    hyperkeratosisDegree: "moderate" | "severe" | "";
    footTemperature: "cold" | "warm" | "hot" | "";
    footColor: "cyanotic" | "pale" | "normal" | "hyperemic" | "";
    nails:
      | "normal"
      | "onychohypertrophy"
      | "onychodystrophy"
      | "onychomycosis"
      | "subungualHematoma"
      | "ingrownNail"
      | "";
    footDeformity: "none" | "flatfoot" | "longitudinal" | "transverse" | "";
    lowerLegs:
      | "normal"
      | "hairLoss"
      | "hyperpigmentation"
      | "spottedLegs"
      | "muscleAtrophy"
      | "";
    halluxValgus: boolean | null;
    hammerToe: boolean | null;
    clawToe: boolean | null;
    digitusSuperductus: boolean | null;
    sensitivity: {
      vibration: { right: number | null; left: number | null };
      temperature: { right: number | null; left: number | null };
      pain: { right: number | null; left: number | null };
      tactile: { right: number | null; left: number | null };
      jointMuscle: { right: number | null; left: number | null };
      achillesReflex: { right: number | null; left: number | null };
      kneeReflex: { right: number | null; left: number | null };
    };
    veins: {
      norm: { right: boolean; left: boolean };
      telangiectasia: { right: boolean; left: boolean };
      varicoseVeins: { right: boolean; left: boolean };
      edema: { right: boolean; left: boolean };
      lipodermatosclerosis: { right: boolean; left: boolean };
      healingUlcer: { right: boolean; left: boolean };
      activeUlcer: { right: boolean; left: boolean };
    };
    lymphedema: boolean | null;
    lymphedemaStage: {
      stageI: { right: boolean; left: boolean };
      stageII: { right: boolean; left: boolean };
      stageIII: { right: boolean; left: boolean };
      stageIV: { right: boolean; left: boolean };
    };
    lasegueSymptom: "negative" | "positive" | "";
    lasegueSide: "right" | "left" | "both" | "";
    lasegueDetails: string;
    footExamNotes: string;
    woundAppearance: string;
  };
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

// ==================== Измерения ====================
export interface Measurements {
  pulseOximetry: { leftHand: number | null; rightHand: number | null };
  pulsePalpation: {
    radialArtery: {
      rhythm: "regular" | "irregular" | "";
      symmetry: "symmetric" | "asymmetric" | "";
    };
    posteriorTibialArtery: { left: boolean | null; right: boolean | null };
    dorsalisPedisArtery: { left: boolean | null; right: boolean | null };
  };
  conditionsMet: boolean | null;
  bpArms: {
    leftSystolic: number | null;
    leftDiastolic: number | null;
    rightSystolic: number | null;
    rightDiastolic: number | null;
  };
  pulsePressure: number | null;
  bpLegs: {
    leftSystolic: number | null;
    leftDiastolic: number | null;
    rightSystolic: number | null;
    rightDiastolic: number | null;
  };
  abiIndex: { left: number | null; right: number | null };
  legPainWalking: boolean | null;
  painStopsAfterRest: boolean | null;
  walkingDistance: string;
  limbColor: string;
  limbTemperature: string;
  limbSkin: string;
  bpRepeat: {
    leftSystolic: number | null;
    leftDiastolic: number | null;
    rightSystolic: number | null;
    rightDiastolic: number | null;
  };
}

// ==================== Вторичные АГ ====================
export interface SecondaryHypertension {
  nsaidsFrequency: string;
  decongestantsFrequency: string;
  otherDrugs: string;
  hyperaldosteronism: {
    polydipsiaPolyuria: boolean | null;
    muscleWeakness: boolean | null;
    limbCramps: boolean | null;
    constipation: boolean | null;
  };
  frequentHeadaches: boolean | null;
  stroke: boolean | null;
  tia: boolean | null;
  tiaDetails: string;
  pheochromocytoma: {
    stableOrCrisis: "stable" | "crisis" | "";
    profuseSweating: boolean | null;
    coldExtremities: boolean | null;
    arrhythmias: boolean | null;
  };
  hypercortisolism: {
    centralObesity: boolean | null;
    moonFace: boolean | null;
    cheekFlush: boolean | null;
    buffaloHump: boolean | null;
    bruises: boolean | null;
    proximalWeakness: boolean | null;
    striae: boolean | null;
    newDiabetes: boolean | null;
    amenorrhea: boolean | null;
  };
  osas: {
    nightSnoring: boolean | null;
    nightAwakenings: boolean | null;
    nocturia: boolean | null;
    daytimeSleepiness: boolean | null;
    obesity: boolean | null;
  };
  familyHistory: {
    hypertension: boolean | null;
    earlyHeartAttackStroke: boolean | null;
    pheochromocytoma: boolean | null;
  };
  pregnancyHypertension: boolean | null;
}

// ==================== ХСН ====================
export interface HeartFailure {
  urineColorChange: boolean | null;
  urineColor: string;
  chestPain: boolean | null;
  chestPainTrigger: "none" | "physical" | "emotional" | "positional" | "";
  radiatesToLeftArm: boolean | null;
  relievesWithNitroglycerin: boolean | null;
  frequentAttacks3Months: boolean | null;
  dyspneaOnExertion: boolean | null;
  dyspneaFunctionalClass: "I" | "II" | "III" | "IV" | "";
  takesTicagrelor: boolean | null;
  smallCircle: {
    pillowsForSleep: boolean | null;
    forcedPosition: boolean | null;
    nightDyspnea: boolean | null;
    acrocyanosis: {
      nasolabialTriangle: boolean;
      hands: boolean;
      feet: boolean;
    };
    saturation: number | null;
  };
  bigCircle: {
    legEdema: boolean | null;
    tightShoes: boolean | null;
    edemaOnset: "long" | "acute" | "";
    symmetric: boolean | null;
    localization: string;
    timeOfDay: "morning" | "evening" | "";
    edemaImprovesNight: boolean | null;
    edemaImprovesElevation: boolean | null;
    edemaTemperature: "cold" | "hot" | "";
    edemaColor: "pale" | "cyanotic" | "hyperemic" | "";
    edemaDensity: "soft" | "dense" | "";
    pittingEdema: boolean | null;
    edemaResolves: "immediate" | "delayed" | "";
    painful: boolean | null;
    takesNifedipineAmlodipineNsaids: boolean | null;
  };
  hepatomegaly: {
    rightHypochondriumPain: boolean | null;
    liverSize: "enlarged" | "notPalpable" | "";
    liverEdge: "smooth" | "bumpy" | "notDefined" | "";
    liverPainful: boolean | null;
    hepaticPulsation: boolean | null;
    hepatojugularReflux: boolean | null;
  };
  jugularVeins: {
    onInspirationAndExpiration: boolean | null;
    onlyOnInspiration: boolean | null;
  };
  nyhaClass: "I" | "IIA" | "IIB" | "III" | "";
}

// ==================== H2FPEF ====================
export interface H2FPEF {
  obesityBMI30: boolean;
  hypertension2Drugs: boolean;
  atrialFibrillation: boolean;
  pulmonaryHypertension: boolean;
  pulmonaryHypertensionValue: number | null;
  elderly60: boolean;
  fillingPressure: boolean;
  fillingPressureValue: number | null;
  totalScore: number;
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

// ==================== Полная форма ====================
export interface AnamnesisFormData {
  fullName?: string;
  birthDate?: string;
  gender?: "male" | "female";

  notes?: Record<string, string>;

  primaryExam?: PrimaryExam;
  type1Diabetes?: Type1Diabetes | null;
  type2Diabetes?: Type2Diabetes | null;
  actualTherapy?: ActualTherapy;
  therapy?: Therapy;
  hypoglycemia?: Hypoglycemia;
  selfMonitoring?: SelfMonitoring;
  complications?: Complications;
  examination?: Examination;
  lifestyle?: Lifestyle;
  measurements?: Measurements;
  secondaryHypertension?: SecondaryHypertension;
  heartFailure?: HeartFailure;
  h2fpef?: H2FPEF;
  additionalHistory?: AdditionalHistory;
}

export interface AnamnesisRecord extends AnamnesisFormData {
  id: string;
  savedAt: string;
}

// ==================== Пациент ====================
export type PatientFormData = PatientBase;

export interface Patient extends PatientBase {
  id: string;
  createdAt: string;
  anamneses: AnamnesisRecord[];
}
