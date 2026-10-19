import type { AnamnesisFormData } from "@/entities/anamnesis";

type Eyes = NonNullable<AnamnesisFormData["eyes"]>;

const emptyEyeSymptom = () => ({
  present: false,
  eye: "" as const,
});

const emptySurgery = () => ({
  selected: false,
  date: "",
  eye: "" as const,
});

export const createEyesDefaults = (): Eyes => ({
  decreasedVisualAcuity: null,
  visualAcuitySign: "",
  visualAcuityValue: null,
  decreasedVisualAcuityEye: "",

  cataract: null,
  cataractEye: "",
  glaucoma: null,
  glaucomaEye: "",

  deteriorationDate: "",
  relativeToDiabetes: "",
  deteriorationCourse: "",

  periodicTriggers: {
    highBP: false,
    lowBP: false,
    highGlucose: false,
    lowGlucose: false,
  },

  nyctalopia: null,
  delayedDarkAdaptation: null,
  blurredVision: null,

  visualPhenomena: {
    floaters: false,
    photopsias: false,
    sparks: false,
    grid: false,
    colorDistortion: false,
  },

  colorDistortionDetails: "",

  otherSymptoms: {
    pain: emptyEyeSymptom(),
    tearing: emptyEyeSymptom(),
    dryness: emptyEyeSymptom(),
    sandSensation: emptyEyeSymptom(),
    photophobia: emptyEyeSymptom(),
  },

  diplopia: null,
  diplopiaTypes: {
    constant: false,
    sideGaze: false,
  },

  externalExam: {
    ptosis: emptyEyeSymptom(),
    miosis: emptyEyeSymptom(),
    mydriasis: emptyEyeSymptom(),
    enophthalmos: emptyEyeSymptom(),
    eyelidEdema: emptyEyeSymptom(),
    caruncleInflammation: emptyEyeSymptom(),
    hemophthalmos: emptyEyeSymptom(),
    hyphema: emptyEyeSymptom(),
  },

  vesselInjection: "",

  visualFieldLoss: null,
  peripheralVisionTest: null,
  hemianopiaType: "",

  chemosis: null,

  ophthalmologistFollowUp: "",

  eyeDrops: null,
  eyeDropsDetails: "",

  surgeries: {
    retinalLaser: emptySurgery(),
    lensReplacement: emptySurgery(),
    intravitrealInjection: emptySurgery(),
  },

  endocrineOphthalmopathy: null,

  exophthalmos: null,
  periorbitalEdema: null,
  scleralInjection: null,

  movementImpairment: null,

  movementDirections: {
    up: false,
    outward: false,
    down: false,
    inward: false,
  },

  eopDiplopia: null,

  eopDiplopiaTypes: {
    constant: false,
    sideGaze: false,
  },

  eopPtosis: null,

  namedSigns: {
    stellwag: false,
    moebius: false,
    graefe: false,
    kocher: false,
    horner: false,
    marie: false,
    jellinek: false,
    dalrymple: false,
    joffroy: false,
    botkin: false,
    rosenbach: false,
    repnevMelekhov: false,
  },

  cas: {
    retrobulbarPain: false,
    gazePain: false,
    eyelidRedness: false,
  },

  ctOrbits: null,
  ctOrbitsPlace: "",
});
