import type { AnamnesisFormData } from "@/entities/anamnesis";

type LifestyleDefaults = NonNullable<AnamnesisFormData["lifestyle"]>;

export const createLifestyleDefaults = (): LifestyleDefaults => ({
  alcoholFrequency: "",
  alcoholType: "",

  smoking: null,
  smokingStartAge: null,
  cigarettesPerDay: null,

  saltFood: null,
  processedFood: null,

  coffeeCupsPerDay: null,
  strongCoffee: null,
  energyDrinks: null,

  occupation: "",
  sedentaryWork: null,
  stress: null,

  chronicEyeDiseases: "",

  asthma: null,
  asthmaDiagnosedWhen: "",
  asthmaAllergen: "",

  copd: null,
  copdMeds: "",

  knownHypertension: "",
  hypertensionFirstDetected: "",
  hypertensionUnderAge35: false,

  hypertensionDetectionEnabled: null,
  hypertensionDetectionDetails: "",
  hypertensionDetectionMethod: "",

  visitedDoctorAfterDetection: null,
  prescribedTherapyThen: "",

  actualAntihypertensiveTherapy: [
    {
      name: "",
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

  therapyRegularity: null,
  missedDosesPerWeek: "",
  missedReasons: "",

  bpOnTherapy: "",
  bpResistant3Drugs: null,

  selfDiscontinued: null,
  doctorChangedTherapy: null,
  therapyCorrectionReason: "",
  changedTherapyDetails: "",

  measureAtHome: null,
  measureFrequency: "",
  keepDiary: null,

  maxBPValues: "",
  subjectiveComplaints: "",

  hypertensionSymptoms: {
    headache: false,
    tinnitus: false,
    visualDisturbances: false,
    palpitations: false,
    hotFlushes: false,
    chestPain: false,
    arrhythmia: false,
    dizziness: false,
    nauseaVomiting: false,
  },

  highBpReliefMedication: "",

  atWhatBPReduced: "",

  hypertensiveCrisesAmbulance: null,
  crisesCount: "",
  crisesSymptoms: "",

  crisisSigns: {
    severeHeadache: false,
    speechDisorder: false,
    visionDisorder: false,
    limbWeakness: false,
    seizures: false,
    lossOfConsciousness: false,
  },

  medicationHypertensionTriggers: {
    glucocorticoids: false,
    combinedOralContraceptives: false,
    bronchodilators: false,
    erythropoietin: false,
    antiretroviralTherapy: false,
    licoriceSupplements: false,
    immunosuppressants: false,
  },

  heartRhythmRegular: null,
  pacemakers: null,
  atrialFibrillation: null,
});
