import type { AnamnesisFormData } from "@/entities/anamnesis";

type HeartFailureDefaults = NonNullable<AnamnesisFormData["heartFailure"]>;

type H2FPEFDefaults = NonNullable<AnamnesisFormData["h2fpef"]>;

export const createHeartFailureDefaults = (): HeartFailureDefaults => ({
  urineColorChange: null,
  urineColor: "",

  chestPain: null,
  chestPainTrigger: "",
  radiatesToLeftArm: null,
  relievesWithNitroglycerin: null,
  frequentAttacks3Months: null,

  dyspneaOnExertion: null,
  dyspneaFunctionalClass: "",

  takesTicagrelor: null,

  smallCircle: {
    pillowsForSleep: null,
    forcedPosition: null,
    nightDyspnea: null,

    acrocyanosis: {
      nasolabialTriangle: false,
      hands: false,
      feet: false,
    },

    saturation: null,
  },

  bigCircle: {
    legEdema: null,
    tightShoes: null,

    edemaOnset: "",
    symmetric: null,
    localization: "",
    timeOfDay: "",

    edemaImprovesNight: null,
    edemaImprovesElevation: null,

    edemaTemperature: "",
    edemaColor: "",
    edemaDensity: "",

    pittingEdema: null,
    edemaResolves: "",
    painful: null,

    takesNifedipineAmlodipineNsaids: null,
  },

  hepatomegaly: {
    rightHypochondriumPain: null,
    liverSize: "",
    liverEdge: "",
    liverPainful: null,
    hepaticPulsation: null,
    hepatojugularReflux: null,
  },

  jugularVeins: {
    onInspirationAndExpiration: null,
    onlyOnInspiration: null,
  },

  nyhaClass: "",
});

export const createH2FPEFDefaults = (): H2FPEFDefaults => ({
  obesityBMI30: false,
  hypertension2Drugs: false,
  atrialFibrillation: false,

  pulmonaryHypertension: false,
  pulmonaryHypertensionValue: null,

  elderly60: false,

  fillingPressure: false,
  fillingPressureValue: null,

  totalScore: 0,
});
