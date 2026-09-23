// ==================== Измерения ====================

export interface Measurements {
  pulseOximetry: {
    leftHand: number | null;

    rightHand: number | null;
  };

  pulsePalpation: {
    radialArtery: {
      rhythm: "regular" | "irregular" | "";

      symmetry: "symmetric" | "asymmetric" | "";
    };

    posteriorTibialArtery: {
      left: boolean | null;

      right: boolean | null;
    };

    dorsalisPedisArtery: {
      left: boolean | null;

      right: boolean | null;
    };
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

  abiIndex: {
    left: number | null;

    right: number | null;
  };

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
