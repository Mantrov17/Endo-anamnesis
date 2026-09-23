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
  hypertensionDetectionMethod: "",

  visitedDoctorAfterDetection: null,
  prescribedTherapyThen: "",

  therapyRegularity: null,
  missedDosesPerWeek: "",
  missedReasons: "",

  bpOnTherapy: "",
  bpResistant3Drugs: null,

  selfDiscontinued: null,
  doctorChangedTherapy: null,
  changedTherapyDetails: "",

  measureAtHome: null,
  measureFrequency: "",
  keepDiary: null,

  maxBPValues: "",
  subjectiveComplaints: "",
  atWhatBPReduced: "",

  hypertensiveCrisesAmbulance: null,
  crisesCount: "",
  crisesSymptoms: "",

  heartRhythmRegular: null,
  pacemakers: null,
  atrialFibrillation: null,
});
