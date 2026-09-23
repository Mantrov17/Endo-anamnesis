import type { AnamnesisFormData } from "@/entities/anamnesis";

type ComplicationsDefaults = NonNullable<AnamnesisFormData["complications"]>;

export const createComplicationsDefaults = (): ComplicationsDefaults => ({
  eyes: {
    visionLoss: null,
    visionLossStart: "",
    visionLossDuration: "",

    nightVisionGood: null,

    lastFundusExamDate: "",

    nyctalopia: null,
    delayedDarkAdaptation: null,

    floaters: null,
    floatersWhen: "",

    visualFieldLoss: null,

    ophthalmologistFrequency: "",
    lastFundusExamUnknown: false,
  },

  nose: {
    snoring: null,
  },

  ears: {
    hearingLoss: null,
    hearingLossStart: "",
    hearingLossDuration: "",
    lastEntExamDate: "",
  },

  gastrointestinal: {
    gastritis: null,
    ulcers: null,
    abdominalPainAfterEating: null,

    stoolFrequency: "",
    stoolConsistency: 5,

    painTriggerFatty: false,
    painTriggerAlcohol: false,
  },

  urinary: {
    kidneyStones: null,
  },

  nephropathy: {
    albuminCreatinine: "",
    gfr: "",
  },

  neuropathy: {
    symptoms: {
      numbness: false,
      pain: false,
      paresthesia: false,
    },

    numbnessTime: "",

    paresthesiaType: {
      crawling: false,
      shots: false,
      allodynia: false,
      hyperalgesia: false,
      nightCramps: false,
      numbness: false,
      burning: false,
    },

    coldFeet: null,
    howWarmFeet: "",
    feetToRadiator: null,

    amputations: null,
    amputationLevel: "",
    amputationDate: "",

    footSkin: "",
    hyperkeratosisDegree: "",
    footTemperature: "",
    footColor: "",
    nails: "",
    footDeformity: "",
    lowerLegs: "",

    halluxValgus: null,
    hammerToe: null,
    clawToe: null,
    digitusSuperductus: null,

    sensitivity: {
      vibration: {
        right: null,
        left: null,
      },

      temperature: {
        right: null,
        left: null,
      },

      pain: {
        right: null,
        left: null,
      },

      tactile: {
        right: null,
        left: null,
      },

      jointMuscle: {
        right: null,
        left: null,
      },

      achillesReflex: {
        right: null,
        left: null,
      },

      kneeReflex: {
        right: null,
        left: null,
      },
    },

    veins: {
      norm: {
        right: false,
        left: false,
      },

      telangiectasia: {
        right: false,
        left: false,
      },

      varicoseVeins: {
        right: false,
        left: false,
      },

      edema: {
        right: false,
        left: false,
      },

      lipodermatosclerosis: {
        right: false,
        left: false,
      },

      healingUlcer: {
        right: false,
        left: false,
      },

      activeUlcer: {
        right: false,
        left: false,
      },
    },

    lymphedema: null,

    lymphedemaStage: {
      stageI: {
        right: false,
        left: false,
      },

      stageII: {
        right: false,
        left: false,
      },

      stageIII: {
        right: false,
        left: false,
      },

      stageIV: {
        right: false,
        left: false,
      },
    },

    lasegueSymptom: "",
    lasegueSide: "",
    lasegueDetails: "",

    footExamNotes: "",
    woundAppearance: "",
  },
});
