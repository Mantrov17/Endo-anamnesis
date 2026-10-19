/** OS — левый, OD — правый, OU — оба глаза. */
export type EyeSide = "OS" | "OD" | "OU" | "";

export interface EyeSymptomWithSide {
  present: boolean;
  eye: EyeSide;
}

export interface EyeSurgery {
  selected: boolean;
  date: string;
  eye: EyeSide;
}

export interface Eyes {
  // Существующие вопросы

  decreasedVisualAcuity: boolean | null;
  visualAcuitySign: "+" | "-" | "";
  visualAcuityValue: number | null;
  decreasedVisualAcuityEye: EyeSide;

  cataract: boolean | null;
  cataractEye: EyeSide;

  glaucoma: boolean | null;
  glaucomaEye: EyeSide;

  deteriorationDate: string;
  relativeToDiabetes: "before" | "after" | "";
  deteriorationCourse: "gradual" | "sudden" | "periodic" | "";

  periodicTriggers: {
    highBP: boolean;
    lowBP: boolean;
    highGlucose: boolean;
    lowGlucose: boolean;
  };

  nyctalopia: boolean | null;
  delayedDarkAdaptation: boolean | null;
  blurredVision: boolean | null;

  visualPhenomena: {
    floaters: boolean;
    photopsias: boolean;
    sparks: boolean;
    grid: boolean;
    colorDistortion: boolean;
  };

  colorDistortionDetails: string;

  // Прочие симптомы

  otherSymptoms: {
    pain: EyeSymptomWithSide;
    tearing: EyeSymptomWithSide;
    dryness: EyeSymptomWithSide;
    sandSensation: EyeSymptomWithSide;
    photophobia: EyeSymptomWithSide;
  };

  diplopia: boolean | null;
  diplopiaTypes: {
    constant: boolean;
    sideGaze: boolean;
  };

  // Внешний осмотр

  externalExam: {
    ptosis: EyeSymptomWithSide;
    miosis: EyeSymptomWithSide;
    mydriasis: EyeSymptomWithSide;
    enophthalmos: EyeSymptomWithSide;
    eyelidEdema: EyeSymptomWithSide;
    caruncleInflammation: EyeSymptomWithSide;
    hemophthalmos: EyeSymptomWithSide;
    hyphema: EyeSymptomWithSide;
  };

  vesselInjection: "normal" | "conjunctival" | "pericorneal" | "mixed" | "";

  visualFieldLoss: boolean | null;

  peripheralVisionTest: boolean | null;
  hemianopiaType:
    | "homonymous"
    | "heteronymous"
    | "heteronymousBitemporal"
    | "homonymousBitemporal"
    | "";

  chemosis: boolean | null;

  ophthalmologistFollowUp: string;

  eyeDrops: boolean | null;
  eyeDropsDetails: string;

  surgeries: {
    retinalLaser: EyeSurgery;
    lensReplacement: EyeSurgery;
    intravitrealInjection: EyeSurgery;
  };

  // Эндокринная офтальмопатия

  endocrineOphthalmopathy: boolean | null;

  exophthalmos: boolean | null;
  periorbitalEdema: boolean | null;
  scleralInjection: boolean | null;

  movementImpairment: boolean | null;

  movementDirections: {
    up: boolean;
    outward: boolean;
    down: boolean;
    inward: boolean;
  };

  eopDiplopia: boolean | null;

  eopDiplopiaTypes: {
    constant: boolean;
    sideGaze: boolean;
  };

  eopPtosis: boolean | null;

  namedSigns: {
    stellwag: boolean;
    moebius: boolean;
    graefe: boolean;
    kocher: boolean;
    horner: boolean;
    marie: boolean;
    jellinek: boolean;
    dalrymple: boolean;
    joffroy: boolean;
    botkin: boolean;
    rosenbach: boolean;
    repnevMelekhov: boolean;
  };

  /**
   * Дополнительные признаки для CAS.
   * Остальные баллы берутся из вопросов осмотра.
   */
  cas: {
    retrobulbarPain: boolean;
    gazePain: boolean;
    eyelidRedness: boolean;
  };

  ctOrbits: boolean | null;
  ctOrbitsPlace: "public" | "private" | "";
}
