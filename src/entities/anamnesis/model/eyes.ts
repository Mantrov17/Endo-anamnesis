/** OS — левый, OD — правый, OU — оба глаза. */
export type EyeSide = "OS" | "OD" | "OU" | "";

export interface EyeSymptomWithSide {
  present: boolean;
  eye: EyeSide;
}

export interface EyePainSymptom extends EyeSymptomWithSide {
  characteristics: {
    constant: boolean;
    spontaneous: boolean;
    onMovement: boolean;
    spontaneousRetrobulbar: boolean;
  };
}

export interface EyeStrabismusSymptom extends EyeSymptomWithSide {
  type: "hypotropia" | "exotropia" | "esotropia" | "";
}

export interface EyeSurgery {
  selected: boolean;
  date: string;
  eye: EyeSide;
}

export interface EyeIntravitrealInjection extends EyeSurgery {
  /** Количество инъекций (№). */
  number: number | null;
  /** Числовая кратность введений. */
  frequency: number | null;
  frequencyPeriod: "day" | "week" | "month" | "";
}

export interface Eyes {
  decreasedVisualAcuity: boolean | null;
  visualAcuitySign: "+" | "-" | "";
  visualAcuityValue: number | null;
  decreasedVisualAcuityEye: EyeSide;
  visualAcuityByEye: {
    OS: { sign: "+" | "-" | ""; value: number | null };
    OD: { sign: "+" | "-" | ""; value: number | null };
  };

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

  otherSymptoms: {
    pain: EyePainSymptom;
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

  externalExam: {
    ptosis: EyeSymptomWithSide;
    miosis: EyeSymptomWithSide;
    mydriasis: EyeSymptomWithSide;
    enophthalmos: EyeSymptomWithSide;
    eyelidEdema: EyeSymptomWithSide;
    eyelidErythema: EyeSymptomWithSide;
    strabismus: EyeStrabismusSymptom;
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

  /** Отдельный переключатель; null сохраняется для старых записей. */
  surgicalTreatment: boolean | null;
  surgeries: {
    retinalLaser: EyeSurgery;
    lensReplacement: EyeSurgery;
    intravitrealInjection: EyeIntravitrealInjection;
  };

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
  movementPainDirections: {
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
  cas: {
    retrobulbarPain: boolean;
    gazePain: boolean;
    eyelidRedness: boolean;
  };
  ctOrbits: boolean | null;
  ctOrbitsPlace: "public" | "private" | "";
}
