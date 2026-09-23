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

  nose: {
    snoring: boolean | null;
  };

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

  urinary: {
    kidneyStones: boolean | null;
  };

  nephropathy: {
    albuminCreatinine: string;

    gfr: string;
  };

  neuropathy: {
    symptoms: {
      numbness: boolean;
      pain: boolean;
      paresthesia: boolean;
    };

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
      vibration: {
        right: number | null;

        left: number | null;
      };

      temperature: {
        right: number | null;

        left: number | null;
      };

      pain: {
        right: number | null;

        left: number | null;
      };

      tactile: {
        right: number | null;

        left: number | null;
      };

      jointMuscle: {
        right: number | null;

        left: number | null;
      };

      achillesReflex: {
        right: number | null;

        left: number | null;
      };

      kneeReflex: {
        right: number | null;

        left: number | null;
      };
    };

    veins: {
      norm: {
        right: boolean;
        left: boolean;
      };

      telangiectasia: {
        right: boolean;
        left: boolean;
      };

      varicoseVeins: {
        right: boolean;
        left: boolean;
      };

      edema: {
        right: boolean;
        left: boolean;
      };

      lipodermatosclerosis: {
        right: boolean;
        left: boolean;
      };

      healingUlcer: {
        right: boolean;
        left: boolean;
      };

      activeUlcer: {
        right: boolean;
        left: boolean;
      };
    };

    lymphedema: boolean | null;

    lymphedemaStage: {
      stageI: {
        right: boolean;
        left: boolean;
      };

      stageII: {
        right: boolean;
        left: boolean;
      };

      stageIII: {
        right: boolean;
        left: boolean;
      };

      stageIV: {
        right: boolean;
        left: boolean;
      };
    };

    lasegueSymptom: "negative" | "positive" | "";

    lasegueSide: "right" | "left" | "both" | "";

    lasegueDetails: string;

    footExamNotes: string;

    woundAppearance: string;
  };
}
