import type { AnamnesisFormData } from "@/entities/anamnesis";

type MeasurementsDefaults = NonNullable<AnamnesisFormData["measurements"]>;

export const createMeasurementsDefaults = (): MeasurementsDefaults => ({
  pulseOximetry: {
    leftHand: null,
    rightHand: null,
  },

  pulsePalpation: {
    radialArtery: {
      rhythm: "",
      symmetry: "",
    },

    posteriorTibialArtery: {
      left: null,
      right: null,
    },

    dorsalisPedisArtery: {
      left: null,
      right: null,
    },
  },

  conditionsMet: null,

  bpArms: {
    leftSystolic: null,
    leftDiastolic: null,
    rightSystolic: null,
    rightDiastolic: null,
  },

  pulsePressure: null,

  bpLegs: {
    leftSystolic: null,
    leftDiastolic: null,
    rightSystolic: null,
    rightDiastolic: null,
  },

  abiIndex: {
    left: null,
    right: null,
  },

  legPainWalking: null,
  painStopsAfterRest: null,
  walkingDistance: "",

  limbColor: "",
  limbTemperature: "",
  limbSkin: "",

  bpRepeat: {
    leftSystolic: null,
    leftDiastolic: null,
    rightSystolic: null,
    rightDiastolic: null,
  },
});
