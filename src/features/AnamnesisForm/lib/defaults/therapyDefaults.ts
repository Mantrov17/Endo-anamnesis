import type { AnamnesisFormData } from "@/entities/anamnesis";

type ActualTherapyDefaults = NonNullable<AnamnesisFormData["actualTherapy"]>;

type TherapyDefaults = NonNullable<AnamnesisFormData["therapy"]>;

export const createActualTherapyDefaults = (): ActualTherapyDefaults => ({
  sameAsInitial: null,
  correctionReason: "",
  correctedTherapy: "",

  injectionMethod: "",
  injectionsDevice: "",
  pumpModel: "",

  basalInsulin: [
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

  bolusInsulin: [
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

  insulinDoseCoefficient: null,
  calculatedDailyInsulinDose: null,

  injectionSites: "",
  lipohypertrophy: null,
});

export const createTherapyDefaults = (): TherapyDefaults => ({
  targetHba1c: "",

  currentDrugs: [
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

  basalInsulin: [
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

  prandialInsulin: [
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
});
